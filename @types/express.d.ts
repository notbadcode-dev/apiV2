import 'express';

declare global {
    namespace Express {
        interface Request {
            ip?: string;
            method?: string;
            url?: string;
            authorization?: string;
        }
    }
}
