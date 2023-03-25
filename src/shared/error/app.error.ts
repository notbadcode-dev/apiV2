import { THttpResponseMessageType } from 'shared/enum/http-response-message.enum';
import TranslationService from 'shared/service/translate.service';

export class AppError extends Error {
    status: number;

    constructor(errorStatus: number, errorMessage?: string, type?: THttpResponseMessageType) {
        const ERROR_STATUS: number = errorStatus;

        if (errorMessage) {
            TranslationService.translate(errorMessage);
        }

        super(errorMessage);
        Object.setPrototypeOf(this, new.target.prototype);
        this.status = ERROR_STATUS;
        Error.captureStackTrace(this);
    }
}
