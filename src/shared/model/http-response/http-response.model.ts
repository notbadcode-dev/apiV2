import { IHttpResponseMessage } from '@model/http-response/http-response-message.model';

export interface IHttpResponse<T = null> {
    data: T | T[] | null | unknown;
    messageList: IHttpResponseMessage[];
}
