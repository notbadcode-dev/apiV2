import LOGGER from '@app/app.logger';
import { Request } from 'express';
import { Service } from 'typedi';

@Service()
export class LoggerService {
    public infoLogger(message: string, meta?: object): void {
        LOGGER.info(message, { meta });
    }

    public errorLogger(message: string, meta?: object): void {
        LOGGER.error(message, { meta });
    }

    public warnLogger(message: string, meta?: object): void {
        LOGGER.warn(message, { meta });
    }

    public debugLogger(message: string, meta?: object): void {
        LOGGER.debug(message, { meta });
    }

    public requestLogger(req: Request): void {
        LOGGER.info(`[${req.ip}] [${req.method}] ${req.url}`, { headers: req.headers, body: req.body });
    }
}

export default { LoggerService };
