import { HTTP_RESPONSE_STATUS } from 'shared/constant/http.constant';

import { AppError } from './app.error';

export class AlreadyExistsError extends AppError {
    constructor(message: string) {
        super(HTTP_RESPONSE_STATUS.ALREADY_EXISTS, message);
    }
}
