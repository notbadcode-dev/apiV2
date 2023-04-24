import { HTTP_RESPONSE_STATUS } from '@constant/http.constant';

import { AppError } from '@error/app.error';

export class NotFountError extends AppError {
    constructor(message?: string) {
        super(message, HTTP_RESPONSE_STATUS.NOT_FOUND);
    }
}
