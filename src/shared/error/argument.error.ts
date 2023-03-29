import { HTTP_RESPONSE_STATUS } from '@constant/http.constant';

import { AppError } from './app.error';

export class ArgumentError extends AppError {
    constructor(message?: string) {
        super(HTTP_RESPONSE_STATUS.ARGUMENT, message);
    }
}
