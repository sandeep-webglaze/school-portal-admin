import { ErrorResponse } from 'api/types';
import { Dispatch, useReducer } from 'react';

export enum ActionType {
    LOADING,
    LOADED,
    ERROR
}

export const DEFAULT_ERROR: ErrorResponse = {
    code: 0,
    message: 'Something went wrong!',
    displayMessage: 'Something went wrong!'
}

export interface DataSourceState<Request, ResponseData> {
    loading: boolean;
    loaded: boolean;
    loadedOnce: boolean;
    reload?: () => void;
    lastRequest?: Request;
    data?: ResponseData;
    err?: ErrorResponse;
}

interface LoadingAction<Request> {
    type: ActionType.LOADING;
    request: Request;
}

interface DataLoadedAction<ResponseData> {
    type: ActionType.LOADED;
    response: ResponseData;
    reload?: () => void;
}

interface ErrorCaughtAction {
    type: ActionType.ERROR;
    err: ErrorResponse;
    reload?: () => void;
}

type DataSourceActionType<Request, ResponseData> = LoadingAction<Request> 
    | DataLoadedAction<ResponseData>
    | ErrorCaughtAction;

function reducer<Request, ResponseData> (
    currentState: DataSourceState<Request, ResponseData>,
    action: DataSourceActionType<Request, ResponseData>
): DataSourceState<Request, ResponseData> {
    switch (action.type) {
        case ActionType.LOADING:
            return {
                loading: true,
                loaded: false,
                loadedOnce: currentState.loadedOnce,
                lastRequest: action.request,
                reload: () => null
            };
        case ActionType.LOADED:
            return {
                loading: false,
                loaded: true,
                loadedOnce: true,
                lastRequest: currentState.lastRequest,
                reload: action.reload,
                data: action.response
            };
        case ActionType.ERROR:
            return {
                loading: false,
                loaded: true,
                loadedOnce: true,
                lastRequest: currentState.lastRequest,
                err: action.err,
                reload: action.reload
            };
    }
}

const INTIAL_DATA = {
    loading: false,
    loaded: false,
    loadedOnce: false,
    reload: () => null
};

export default function useDataSource<Request, ResponseData>() {
    const [state, dispatch] = useReducer(reducer, INTIAL_DATA);
    return [ state, dispatch] as [
        DataSourceState<Request, ResponseData>,
        Dispatch<DataSourceActionType<Request, ResponseData>>
    ];
}