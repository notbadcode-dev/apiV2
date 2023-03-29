import { HTTP_RESPONSE_STATUS } from '@constant/http.constant';

import { AppError } from './app.error';

export class NoContentError extends AppError {
    constructor(message: string) {
        super(HTTP_RESPONSE_STATUS.BAD_REQUEST, message);
    }
}
