import { Store } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { Action, ClassActionType, classSliceActionPrefix, NetworkHandlerCallback, State } from './ui';
import { NewType } from './types';
import { ClassRequest, IClassRequest, ClassMessage, IClassResponse } from './protobuf';
import { messageToClassAction } from './protobuf/actions';
import { EventEmitter } from 'eventemitter3';
import { ConnectionStatus, setConnectionError, setConnectionStatus } from './redux/network';
import { RPC, TransportState, WSTransport } from "./rpc" 

export type RequestID = NewType<string, 'RequestID'>
export const newRequestId = (value: string): RequestID => value as RequestID;

export class Network<ApplicationState=unknown> {
    private transport?: WSTransport
    private rpc = new RPC<RequestID, IClassRequest, undefined, string>(
        (r) => this.send(r),
    );  
    
    private actionEmitter = new EventEmitter();
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

    private async connect(url: string) {
        this.transport = new WSTransport(
            url,
            (t,d) => this.onNetworkMessage(t,d),
            (_,s) => this.onStateChange(s),
            ['live'],
            true,
        )
        return this.transport.connect()
    }

    private onStateChange(state: TransportState) {
        switch(state) {
            
        }
    }


    private onNetworkMessage(transport: WSTransport, data: unknown) {
        if (!(data instanceof ArrayBuffer)) {
            transport.close(4401, 'Binary only protocol');
            return;
        }
        try {
            if (data.byteLength <= 0) { return; }
            const message = ClassMessage.decode(new Uint8Array(data));

            if (message.response && message.response.id) {
                const requestId = newRequestId(message.response.id);
                if(message.response.error) {
                    this.rpc.error(requestId, message.response.error)
                } else {
                    this.rpc.success(requestId, undefined)
                }
            }

            const action = messageToClassAction(message);
            if (!action) { return; }
            this.store.dispatch(action);
            const state = this.selector(this.store.getState())
            this.actionEmitter.emit(action.type, action.payload, state);
        } catch (e) {
            console.error(e)
            transport.close(4400, 'Parse error');
        }
    }

    public async send(command: IClassRequest): Promise<void> {
        if (!this.transport) { throw Error('websocket has not been initialised'); }
        const requestId = nanoid() as RequestID;
        const bytes = ClassRequest.encode({ requestId, ...command }).finish();
        const sent = await this.transport.send(bytes);
    }

}