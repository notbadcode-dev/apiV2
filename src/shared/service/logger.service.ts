import logger from '@app/app.logger';
import { Request } from 'express';
import { Service } from 'typedi';

@Service()
export class LoggerService {
    public infoLogger(message: string, meta?: object): void {
        logger.info(message, { meta });
    }

    public errorLogger(message: string, meta?: object): void {
        logger.error(message, { meta });
    }

    public warnLogger(message: string, meta?: object): void {
        logger.warn(message, { meta });
    }

    public debugLogger(message: string, meta?: object): void {
        logger.debug(message, { meta });
    }

    public requestLogger(req: Request): void {
        logger.info(`[${req.ip}] [${req.method}] ${req.url}`, { headers: req.headers, body: req.body });
    }
}

export default { LoggerService };
