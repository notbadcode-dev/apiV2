import 'express';

declare module 'express' {
    interface Request extends Request {
        ip: string;
        method: string;
        url: string;
    }
}
