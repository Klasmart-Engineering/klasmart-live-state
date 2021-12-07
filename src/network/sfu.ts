import {types as MediaSoup, Device} from "mediasoup-client"
import { NewType } from '../types';
import { TransportState, WSTransport } from '../network/websocketTransport';
import { PromiseCompleter } from '../network/promiseCompleter';


type RequestId = NewType<string, "requestId">
type ProducerId = NewType<string, "producerId">
type ConsumerId = NewType<string, "consumerId">

type RequestMessage = {
    id: RequestId,
    request: Request,
}

type Request = {
    rtpCapabilities?: MediaSoup.RtpCapabilities;
    producerTransport?: unknown;
    producerTransportConnect?: { dtlsParameters: MediaSoup.DtlsParameters };
    createTrack?: { kind: MediaSoup.MediaKind, rtpParameters: MediaSoup.RtpParameters };
    consumerTransport?: unknown;
    consumerTransportConnect?: { dtlsParameters: MediaSoup.DtlsParameters };
    createConsumer?: { producerId: ProducerId };
    locallyPause?: { paused: boolean, id: ProducerId };
    globallyPause?: { paused: boolean, id: ProducerId };
    end?: unknown;
}

type Response = {
    id: RequestId;
    error: string,
} | {
    id: RequestId;
    result: Result|void,
}


type ResponseMessage = {
    response?: Response,
    consumerCreated?: {
        id: ConsumerId,
        producerId: ProducerId,
        kind: MediaSoup.MediaKind,
        rtpParameters: MediaSoup.RtpParameters,
        paused: boolean,
    },
    consumerPaused?: {
        id: ProducerId,
        local: boolean,
        global: boolean,
    },
    producerPaused?: {
        id: ProducerId,
        local: boolean,
        global: boolean,
    },
    consumerClosed?: {
        id: ProducerId,
    },
    producerClosed?: {
        id: ProducerId,
    },
}


export type WebRtcTransportResult = {
    id: string,
    iceCandidates: MediaSoup.IceCandidate[],
    iceParameters: MediaSoup.IceParameters,
    dtlsParameters: MediaSoup.DtlsParameters,
}

type Result = {
    producerTransport?: WebRtcTransportResult;
    consumerTransport?: WebRtcTransportResult;
}


export class SFU {
    private readonly device = new Device();
    private readonly consumers = new Map<ProducerId, MediaSoup.Consumer>()
    private readonly producers = new Map<ProducerId, MediaSoup.Producer>()
    private rtpCapabilities?: MediaSoup.RtpCapabilities
    
    private readonly promiseCompleter = new PromiseCompleter<Result|void, string, RequestId>()
    private readonly ws: WSTransport
    
    public constructor(
        readonly url: string,
    ) {
        this.ws = new WSTransport(
            url,
            (_,d) => this.onTransportMessage(d),
            t => this.onTransportStateChange(t),
            ['live-sfu'],
            true
        )
        this.ws.connect() 
    }

    public async createTrack(track: MediaStreamTrack) {
        const producerTransport = await this.producerTransport();
        const producer = await producerTransport.produce({track})
        this.producers.set(producer.id as ProducerId, producer);
    }

    public async consumeTrack(producerId: ProducerId) {
        const consumerTransport = await this.consumerTransport()
        await this.sendRtpCapabilities()
        const response = await this.request({createConsumer: { producerId }})
    }

    
    private _consumerTransportPromise?: Promise<MediaSoup.Transport>
    private _consumerTransport?: MediaSoup.Transport
    private async consumerTransport() {
        if(this._consumerTransport) {return this._consumerTransport;}
        if(!this._consumerTransportPromise) {
            this._consumerTransportPromise = new Promise(async (resolve, reject) => {
                try {
                    const result = await this.request({consumerTransport: {}})
                    if(!result) { return reject('Empty response from SFU') }
                    const {consumerTransport} = result
                    if(!consumerTransport) { return reject('Response from SFU does not contain consumer transport') }
                    this._consumerTransport = this.device.createRecvTransport(consumerTransport)
                    this._consumerTransport.on("connect", ({dtlsParameters}) => this.request({consumerTransportConnect: {dtlsParameters}}))
                    return this._consumerTransport
                } catch(e) {
                    reject(e)
                }
            })
        }
        return this._consumerTransportPromise;
    }


    private _producerTransportPromise?: Promise<MediaSoup.Transport>
    private _producerTransport?: MediaSoup.Transport
    private async producerTransport() {
        if(this._producerTransport) { return this._producerTransport; }
        if(!this._producerTransportPromise) {
            this._producerTransportPromise = new Promise(async (resolve, reject) => {
                try {
                    const result = await this.request({producerTransport: {}})
                    if(!result) { return reject('Empty response from SFU'); }
                    const {producerTransport} = result
                    if(!producerTransport) { return reject('Response from SFU does not contain producer transport'); }
                    this._producerTransport = this.device.createSendTransport(producerTransport)
                    this._producerTransport.on("connect", ({dtlsParameters}) => this.request({producerTransportConnect: {dtlsParameters}}))
                    this._producerTransport.on("produce", (createTrack) => this.request({createTrack}))
                    resolve(this._producerTransport)
                } catch(e) {
                    reject(e)
                }
            })
        }
        return this._producerTransportPromise;
    }

    private sentRtpCapabilities = false
    private async sendRtpCapabilities() {
        if(this.sentRtpCapabilities) { return }
        const {rtpCapabilities} = this.device
        await this.request({rtpCapabilities})
        this.sentRtpCapabilities = true
    }

    private async request(request: Request) {
        const id = this.generateRequestId()
        await this.ws.send(JSON.stringify({id, request}))
        return this.promiseCompleter.createPromise(id)
    }
    private _requestId = 0
    private generateRequestId() { return `${this._requestId++}` as RequestId; }



    private onTransportStateChange(state: TransportState) {}

    private onTransportMessage(data: string | ArrayBuffer | Blob) {
        const message = this.parse(data)
        if(!message) { this.ws.disconnect(4400); return }
        try {
            this.handleMessage(message)
        } catch(e: unknown) {
            console.error(e);
        }
    }

    private parse(data: string | ArrayBuffer | Blob): ResponseMessage | undefined {
        if(typeof data !== "string") { return; }
        const response = JSON.parse(data.toString()) as ResponseMessage;
        if(typeof response !== "object" || !response) { return; }
        return response
    }

    private async handleMessage(message: ResponseMessage) {
        if(message.response) { this.response(message.response); }
        if(message.consumerClosed) { }
        if(message.consumerCreated) {
            const {id, kind, producerId, rtpParameters, paused} = message.consumerCreated
            this._consumerTransport = this.device.createRecvTransport({})
        }

    }

    private response(response: Response) {
        const { id } = response
        if('error' in response) {
            this.promiseCompleter.reject(id, response.error);
        } else {
            this.promiseCompleter.resolve(id, response.result);
        }
    }



}
