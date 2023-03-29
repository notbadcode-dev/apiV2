import TranslationService from '@service/translate.service';

export class AppError extends Error {
    status!: number;

    constructor(errorStatus: number, errorMessage?: string) {
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
