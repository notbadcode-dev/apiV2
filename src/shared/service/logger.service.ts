import LOGGER from '@app/app.logger';
import { GlobalUtilEnvService } from '@service/global/global.util.env.service/global.util.env.service';
import { Request } from 'express';
import { Service } from 'typedi';

@Service()
export class LoggerService {
    private globalUtilEnvService: GlobalUtilEnvService = new GlobalUtilEnvService();

    //#region Public methods

    public infoLogger(message: string, meta?: object): void {
        if (this.globalUtilEnvService.getRunTest()) {
            return;
        }

        LOGGER.info(message, { meta });
    }

    public errorLogger(message: string, meta?: object): void {
        if (this.globalUtilEnvService.getRunTest()) {
            return;
        }

        LOGGER.error(message, { meta });
    }

    public warnLogger(message: string, meta?: object): void {
        if (this.globalUtilEnvService.getRunTest()) {
            return;
        }

        LOGGER.warn(message, { meta });
    }

    public debugLogger(message: string, meta?: object): void {
        if (this.globalUtilEnvService.getRunTest()) {
            return;
        }

        LOGGER.debug(message, { meta });
    }

    public requestLogger(req: Request): void {
        if (this.globalUtilEnvService.getRunTest()) {
            return;
        }

        LOGGER.info(`[${req.ip}] [${req.method}] ${req.url}`, { headers: req.headers, body: req.body });
    }

    //#endregion
}

export default { LoggerService };
