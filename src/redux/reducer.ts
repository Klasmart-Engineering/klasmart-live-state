import { combineReducers } from 'redux';
import { ValueOf } from '../types';
import { ClassAction, classReducer } from './class';
import { NetworkAction, networkReducer } from './network';
import { webrtcSlice } from './sfu';

export const reducer = combineReducers({
  class: classReducer,
  network: networkReducer,
  webrtc: webrtcSlice.reducer,
});

export type State = ReturnType<typeof reducer> 
export type Action = never
  | ClassAction
  | NetworkAction
  | ReturnType<ValueOf<typeof webrtcSlice.actions>>
