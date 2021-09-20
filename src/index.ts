export * as Server from './server';
export * as Client from './client';
export { NetworkContext } from './react/context';
export { NetworkProvider } from './react/provider';
export { useIsConnected } from './react/hooks/useIsConnected';
export { JoinClassHook, useJoinClass } from './react/hooks/useJoinClass';

export type ID = string;

export interface Context {
  userId: ID;
  isTeacher: boolean;
  name: string;
}

export type ContextPayload<T> = {
  context: Context;
  payload: T;
};