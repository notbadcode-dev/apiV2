export class AppError extends Error {
    status: number;

    constructor(errorStatus: number, errorMessage?: string) {
        const ERROR_STATUS: number = errorStatus;

        super(errorMessage);
        Object.setPrototypeOf(this, new.target.prototype);
        this.status = ERROR_STATUS;
        Error.captureStackTrace(this);
    }
}
