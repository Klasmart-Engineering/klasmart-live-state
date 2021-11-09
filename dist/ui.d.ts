export * as pb from './protobuf';
export * from './protobuf/actions';
export * from './react/hooks/actions';
export * from './react/hooks/state';
export * from './react/hooks/handler';
export * from './react/context';
export * from './react/provider';
export * from './redux/class';
export * from './redux/network';
export * from './roles';
export * from './models';
import { ClassAction } from './redux/class';
import { NetworkAction } from './redux/network';
export declare const reducer: import("redux").Reducer<import("redux").CombinedState<{
    class: import("./models").ClassState;
    network: import("redux").CombinedState<{
        connectionStatus: import("./redux/network").ConnectionStatus;
        connectionError: boolean;
    }>;
}>, import("redux").AnyAction>;
export declare type State = ReturnType<typeof reducer>;
export declare type Action = ClassAction | NetworkAction;
//# sourceMappingURL=ui.d.ts.map