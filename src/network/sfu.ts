import { types as MediaSoup, Device } from "mediasoup-client"
import { NewType } from '../types';
import { TransportState, WSTransport } from '../network/websocketTransport';
import { PromiseCompleter } from '../network/promiseCompleter';
import { Store } from "@reduxjs/toolkit";
import { Action, State } from "../redux/reducer";
import { webrtcSlice } from "../redux/sfu";

export type SfuID = NewType<string, "sfuId">
export type ProducerID = NewType<string, "producerId">
export type ConsumerID = NewType<string, "consumerId">
export type RequestID = NewType<string, "requestId">

type RequestMessage = {
  id: RequestID,
  request: Request,
}

type Request = {
  routerRtpCapabilities?: unknown;
  producerTransport?: unknown;
  producerTransportConnect?: { dtlsParameters: MediaSoup.DtlsParameters };
  createTrack?: { kind: MediaSoup.MediaKind, rtpParameters: MediaSoup.RtpParameters };

  rtpCapabilities?: MediaSoup.RtpCapabilities;
  consumerTransport?: unknown;
  consumerTransportConnect?: { dtlsParameters: MediaSoup.DtlsParameters };
  createConsumer?: { producerId: ProducerID };

  locallyPause?: { paused: boolean, id: ProducerID };
  globallyPause?: { paused: boolean, id: ProducerID };
  end?: unknown;
}

type Response = {
  id: RequestID;
  error: string,
} | {
  id: RequestID;
  result: Result | void,
}

type ResponseMessage = {
  response?: Response,
  consumerPaused?: PauseMessage,
  producerPaused?: PauseMessage,
  consumerClosed?: ProducerID
  producerClosed?: ProducerID
}

export type PauseMessage = {
  id: ProducerID,
  localPause: boolean,
  globalPause: boolean,
}

export type WebRtcTransportResult = {
  id: string,
  iceCandidates: MediaSoup.IceCandidate[],
  iceParameters: MediaSoup.IceParameters,
  dtlsParameters: MediaSoup.DtlsParameters,
  sctpParameters?: MediaSoup.SctpParameters,
}


type Result = {
  routerRtpCapabilities?: MediaSoup.RtpCapabilities;
  producerTransport?: WebRtcTransportResult;
  consumerTransport?: WebRtcTransportResult;
  consumerCreated?: {
    id: ConsumerID,
    producerId: ProducerID,
    kind: MediaSoup.MediaKind,
    rtpParameters: MediaSoup.RtpParameters,
    paused: boolean,
  },
}

export type Track = {
  producer?: MediaSoup.Producer
  consumer?: MediaSoup.Consumer
  localPause: boolean
  globalPause: boolean
}

export class SFU<ApplicationState = unknown> {
  private readonly device = new Device();
  private readonly tracks = new Map<ProducerID, Track>()

  private readonly promiseCompleter = new PromiseCompleter<Result | void, string, RequestID>()
  private readonly ws: WSTransport

  public constructor(
    private readonly id: SfuID,
    private readonly store: Store<ApplicationState, Action>,
    private readonly selector: (s: ApplicationState) => State,
    readonly url: string,
  ) {
    this.ws = new WSTransport(
      url,
      (_, d) => this.onTransportMessage(d),
      t => this.onTransportStateChange(t),
      ['live-sfu'],
      true,
      null,
      null,
    )
    this.ws.connect().catch(e => console.error(e))
  }


  public async getTrack(id: ProducerID) {
    const track = this.tracks.get(id)
    const mediaTrack = track?.producer?.track || track?.consumer?.track
    if(mediaTrack) {return mediaTrack}
    const consumer = await this.consumeTrack(id);
    return consumer.track
  }

  public async produceTrack(track: MediaStreamTrack) {
    const producerTransport = await this.producerTransport();
    const canProduce = this.device.canProduce(track.kind as MediaSoup.MediaKind)
    if(!canProduce) { console.warn(`It seems like the remote router is not ready or can not recieve '${track.kind}' tracks`); }
    console.log("produceTrack", track)
    const producer = await producerTransport.produce({
      track,
      zeroRtpOnPause: true,
      disableTrackOnPause: true,
      stopTracks: true,
    })
    console.log("producer", producer)
    producer.on("transportclose", () => console.log(`Producer(${producer.id})'s Transport(${producerTransport.id}) closed`));
    producer.on("trackended", () => console.log(`Producer(${producer.id}) ended`));

    this.setTrack(producer.id as ProducerID, {
      producer,
      localPause: producer.paused,
      globalPause: false
    })
    return producer
  }

  private async consumeTrack(producerId: ProducerID) {
    const consumerTransport = await this.consumerTransport()
    await this.sendRtpCapabilities()
    const response = await this.request({ createConsumer: { producerId } })
    if (!response) { throw new Error(`Received empty response from SFU when trying to consume producerId(${producerId})`) }
    if (!response.consumerCreated) { throw new Error(`Received response without consumer parameters from SFU when trying to consume producerId(${producerId})`) }

    const consumer = await consumerTransport.consume(response.consumerCreated)
    consumer.on("transportclose", () => console.log(`Consumer(${consumer.id})'s Transport(${consumerTransport.id}) closed`));
    consumer.on("trackended", () => console.log(`Consumer(${consumer.id}) ended`));

    this.setTrack(consumer.id as ProducerID, {
      consumer,
      localPause: consumer.paused,
      globalPause: false
    })
    return consumer
  }

  @SFU.ExecuteOnce()
  private async consumerTransport(){
    const response = await this.request({ consumerTransport: {} })
    if (!response) { throw new Error('Empty response from SFU') }
    const { consumerTransport } = response
    if (!consumerTransport) { throw new Error('Response from SFU does not contain consumer transport') }
    const transport = this.device.createRecvTransport(consumerTransport)
    transport.on("connect", ({ dtlsParameters }, success, error) => this.request({ consumerTransportConnect: { dtlsParameters } }).then(success, error))
    transport.on("connectionstatechange", (connectionState: MediaSoup.ConnectionState) => {
      const action = webrtcSlice.actions.setConsumerConnectionStatus({ id: this.id, connectionState })
      this.store.dispatch(action)
    })
    return transport
  }

  @SFU.ExecuteOnce()
  private async producerTransport(){
    await this.loadDevice()
    const result = await this.request({ producerTransport: {} })
    if (!result) { throw new Error('Empty response from SFU'); }
    const { producerTransport } = result
    if (!producerTransport) { throw new Error('Response from SFU does not contain producer transport'); }
    const transport = this.device.createSendTransport(producerTransport)
    transport.on("connect", (producerTransportConnect, callback, error) => this.request({ producerTransportConnect }).then(callback, error))
    transport.on("produce", (createTrack) => this.request({ createTrack }))
    transport.on("connectionstatechange", (connectionState: MediaSoup.ConnectionState) => {
      const action = webrtcSlice.actions.setProducerConnectionStatus({ id: this.id, connectionState })
      this.store.dispatch(action)
    })
    return transport
  }


  @SFU.ExecuteOnce()
  private async sendRtpCapabilities() {
    const { rtpCapabilities } = this.device
    await this.request({ rtpCapabilities })
  }

  @SFU.ExecuteOnce()
  private async loadDevice(){
    const response = await this.request({routerRtpCapabilities: {}})
    if (!response) { throw new Error('Empty routerRtpCapabilities response from SFU'); }
    const routerRtpCapabilities = response.routerRtpCapabilities
    if(!routerRtpCapabilities) { throw new Error('Response from SFU does not contain routerRtpCapabilities'); }
    await this.device.load({routerRtpCapabilities})
  }

  private async request(request: Request) {
    const id = this.generateRequestId()
    const message: RequestMessage = { id, request }
    await this.ws.send(JSON.stringify(message))
    return this.promiseCompleter.createPromise(id)
  }

  private _requestId = 0
  private generateRequestId() { return `${this._requestId++}` as RequestID; }

  private onTransportStateChange(state: TransportState) {
    console.log(`Transport state changed to ${state}`)
  }

  private onTransportMessage(data: string | ArrayBuffer | Blob) {
    const message = SFU.parse(data)
    if (!message) { this.ws.disconnect(4400); return }
    this.handleMessage(message).catch(e => console.error(e));
  }

  private static parse(data: string | ArrayBuffer | Blob): ResponseMessage | undefined {
    if (typeof data !== "string") { return; }
    const response = JSON.parse(data.toString()) as ResponseMessage;
    if (typeof response !== "object" || !response) { return; }
    return response
  }

  private async handleMessage(message: ResponseMessage) {
    if (message.response) { this.response(message.response); }
    if (message.consumerPaused) { this.handlePauseMessage(message.consumerPaused); }
    if (message.producerPaused) { this.handlePauseMessage(message.producerPaused); }

    //Assumes that the user can't have both a producer and consumer for the same track
    if (message.consumerClosed) { this.closeTrack(message.consumerClosed); }
    if (message.producerClosed) { this.closeTrack(message.producerClosed); }
  }

  private response(response: Response) {
    const { id } = response
    if ('error' in response) {
      this.promiseCompleter.reject(id, response.error);
    } else {
      this.promiseCompleter.resolve(id, response.result);
    }
  }

  private closeTrack(producerId: ProducerID) {
    this.tracks.delete(producerId)

    const action = webrtcSlice.actions.closeTrack({ id: this.id, producerId })
    this.store.dispatch(action)
  }

  private setTrack(producerId: ProducerID, track: Track) {
    this.tracks.set(producerId, track)
    const action = webrtcSlice.actions.setTrack({
      id: this.id,
      producerId,
      status: {
        localPause: track.localPause,
        globalPause: track.globalPause
      }
    })
    this.store.dispatch(action)
  }

  private handlePauseMessage({ id: producerId, localPause, globalPause }: PauseMessage) {
    const track = this.tracks.get(producerId)
    if (!track) { return console.error(`Could not find Track(${producerId}) to pause/resume producer`) }

    track.localPause = localPause
    track.globalPause = globalPause

    const action = webrtcSlice.actions.setTrack({ id: this.id, producerId, status: { localPause, globalPause } })
    this.store.dispatch(action)
  }

  /// Decorator that ensures the decorated method body is executed only once.  All subsequent calls return the same value as the first call.
  private static ExecuteOnce() {
    return (_target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
      const childFunction = descriptor.value;
      if (typeof childFunction !== "function") {
        throw new TypeError(`Only methods can be decorated with @ExecuteOnce.  Property ${String(propertyKey)} is not a method.`);
      }
      descriptor.value = function (this: SFU, ...args: never[]) {
        let value: Promise<unknown> | undefined;
        if (!value) {
          value = new Promise((resolve, reject) => childFunction.apply(this, args).then(resolve, reject));
        }
        return value
      };
      return descriptor;
    };
  }
}
