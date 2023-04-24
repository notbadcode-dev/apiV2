import { HTTP_RESPONSE_STATUS } from '@constant/http.constant';
import { AppError } from '@error/app.error';

export class InternalServerError extends AppError {
    constructor(message: string) {
        super(message, HTTP_RESPONSE_STATUS.INTERNAL_SERVER_ERROR);
    }
}
