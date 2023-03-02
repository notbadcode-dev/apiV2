import { IHttpResponseMessage } from './http-response-message.model';

export interface IHttpResponse<T = null> {
    data: T | T[] | null | unknown;
    messageList: IHttpResponseMessage[];
}
