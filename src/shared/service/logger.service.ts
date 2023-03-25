import logger from 'app.logger';
import { Request } from 'express';
import { Service } from 'typedi';

@Service()
export class LoggerService {
    static infoLogger(message: string, meta?: object): void {
        logger.info(message, { meta });
    }
    static errorLogger(message: string, meta?: object): void {
        logger.error(message, { meta });
    }
    static warnLogger(message: string, meta?: object): void {
        logger.warn(message, { meta });
    }
    static debugLogger(message: string, meta?: object): void {
        logger.debug(message, { meta });
    }
    static requestLogger(req: Request): void {
        logger.info(`[${req.ip}] [${req.method}] ${req.url}`, { headers: req.headers, body: req.body });
    }
}
