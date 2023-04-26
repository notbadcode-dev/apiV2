import { HTTP_RESPONSE_STATUS } from '@constant/http.constant';

import { AppError } from '@error/app.error';

export class CriticalServerError extends AppError {
    constructor(message: string) {
        super(message, HTTP_RESPONSE_STATUS.CRITICAL_SERVER_ERROR);
    }
}
