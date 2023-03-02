import { THttpResponseMessageType } from 'shared/enum/http-response-message.enum';

export interface IHttpResponseMessage {
    type: THttpResponseMessageType;
    content: string;
}
