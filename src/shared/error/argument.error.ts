import { HTTP_RESPONSE_STATUS } from 'shared/constant/http.constant';
import { THttpResponseMessageType } from 'shared/enum/http-response-message.enum';

import { AppError } from './app.error';

export class ArgumentError extends AppError {
    constructor(message?: string, type?: THttpResponseMessageType) {
        super(HTTP_RESPONSE_STATUS.ARGUMENT, message, type);
    }
}
