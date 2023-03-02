export enum EHttpResponseMessageType {
    info = 'info',
    success = 'success',
    warning = 'warning',
    error = 'error',
    critical = 'critical',
}

export type THttpResponseMessageType =
    | EHttpResponseMessageType.info
    | EHttpResponseMessageType.success
    | EHttpResponseMessageType.warning
    | EHttpResponseMessageType.error
    | EHttpResponseMessageType.critical;
