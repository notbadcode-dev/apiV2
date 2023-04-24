export class AppError extends Error {
    static readonly DEFAULT_STATUS = 500;

    private _status: number = AppError.DEFAULT_STATUS;

    constructor(errorMessage?: string, errorStatus: number = AppError.DEFAULT_STATUS) {
        const TRANSLATED_MESSAGE = errorMessage;
        super(TRANSLATED_MESSAGE);
        Object.setPrototypeOf(this, new.target.prototype);
        this._status = errorStatus;
    }

    get status(): number {
        return this._status;
    }

    set status(status: number) {
        this._status = status;
    }
}
