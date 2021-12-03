import { Store } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Action, ClassActionType, classSliceActionPrefix, NetworkHandlerCallback, State } from './ui';
import { NewType } from './types';
import { ClassRequest, IClassRequest, ClassMessage, IClassResponse } from './protobuf';
import { messageToClassAction } from './protobuf/actions';
import { EventEmitter } from 'eventemitter3';
import { setConnectionState } from './redux/network';
import { TransportState, WSTransport } from "./websocketTransport" 
import { PromiseCompleter } from './promiseCompleter';

export type RequestID = NewType<string, 'RequestID'>
export const newRequestId = (value: string): RequestID => value as RequestID;

export class Network<ApplicationState=unknown> {
    private readonly rpc = new PromiseCompleter<void, string, RequestID>();  
    private transport?: WSTransport
    
    private readonly actionEmitter = new EventEmitter();
    constructor(
        /* eslint-disable no-unused-vars */
        public readonly store: Store<ApplicationState, Action>,
        public readonly selector: (s: ApplicationState) => State,
        /* eslint-enable no-unused-vars */
    ) { }

    public onClassAction<T extends ClassActionType = ClassActionType>(actionType: T, f: NetworkHandlerCallback<T>) {
        // TODO: This event mapping is highly specific to the class slice, how to accomodate additional reducers/slices
        const event = `${classSliceActionPrefix}/${actionType}`
        this.actionEmitter.addListener(event, f)
        return () => {
          this.actionEmitter.removeListener(event, f)
        }
    }

    public async connect(url: string) {
        if(this.transport) { this.transport.disconnect() }
        this.transport = new WSTransport(
            url,
            (t,d) => this.onNetworkMessage(t,d),
            (s) => this.onStateChange(s),
            ['live'],
            true,
        )
        return await this.transport.connect()
    }

    public disconnect(code?: number, reason?: string) {
        this.transport?.disconnect(code, reason)
    }

    private onStateChange(state: TransportState) {
        this.store.dispatch(setConnectionState(state));
    }

    private onNetworkMessage(transport: WSTransport, data: unknown) {
        if (!(data instanceof ArrayBuffer)) {
            transport.disconnect(4401, 'Binary only protocol');
            return;
        }
        try {
            if (data.byteLength <= 0) { return; }
            const message = ClassMessage.decode(new Uint8Array(data));

            if (message.response) { this.handleResponse(message.response) }

            const action = messageToClassAction(message);
            if (!action) { return; }

            this.store.dispatch(action);
            const state = this.selector(this.store.getState())
            this.actionEmitter.emit(action.type, action.payload, state);
        } catch (e) {
            console.error(e)
            transport.disconnect(4400, 'Parse error');
        }
    }

    private handleResponse(response: IClassResponse) {
        if(!response.id) { return }
        const requestId = newRequestId(response.id);
        if(response.error) {
            this.rpc.reject(requestId, response.error)
        } else {
            this.rpc.resolve(requestId)
        }
    }

    public async send(command: IClassRequest): Promise<void> {
        if (!this.transport) { throw Error('WebSocket has not been initialised'); }
        const requestId = nanoid() as RequestID;
        const bytes = ClassRequest.encode({ requestId, ...command }).finish();
        await this.transport.send(bytes);
        return this.rpc.createPromise(requestId)
    }

}