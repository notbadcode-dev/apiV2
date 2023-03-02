import { HTTP_RESPONSE_STATUS } from 'shared/constant/http.constant';

import { AppError } from './app.error';

export class NotFountError extends AppError {
    constructor(message?: string) {
        super(HTTP_RESPONSE_STATUS.NOT_FOUND, message);
    }
}
