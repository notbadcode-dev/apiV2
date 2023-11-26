import { CriticalServerError } from '@error/critical-server.error';
import { IEnvironment } from '@model/environment/environment';
import { Service, Token } from 'typedi';

import { ERROR_MESSAGE_API } from '@constant/error-message/error-message-api.constant';
import { IGlobalUtilEnvService } from '@service/global/global.util.env.service/global.util.env.service.interface';
import { Algorithm } from 'jsonwebtoken';

export const GLOBAL_UTIL_ENV_SERVICE_TOKEN = new Token<IGlobalUtilEnvService>('GlobalUtilEnvService');

@Service(GLOBAL_UTIL_ENV_SERVICE_TOKEN)
export class GlobalUtilEnvService implements IGlobalUtilEnvService {
    //#region Public methods

    public getLoggingEnabled(): boolean {
        return process.env.LOGGING_ENABLED?.includes('true') ? true : false;
    }

    public getSessionSecret(): string {
        return this.getStringEnvironmentVariable(process.env.SESSION_SECRET);
    }

    public getSessionExpiresIn(): string {
        return this.getStringEnvironmentVariable(process.env.SESSION_EXPIRES_IN);
    }

    public getHashedAlgorithm(): Algorithm {
        return this.getStringEnvironmentVariable(process.env.HASHED_ALGORITHM) as Algorithm;
    }

    public getRunTest(): boolean {
        const RUN_TEST: string = this.getStringEnvironmentVariable(process.env.RUN_TEST);
        return RUN_TEST === 'true';
    }

    public getAuthEnvironment(): IEnvironment {
        return {
            port: this.getNumberEnvironmentVariable(process.env.API_AUTH_PORT),
            path: this.getStringEnvironmentVariable(process.env.API_AUTH_PATH),
            apiTitle: this.getStringEnvironmentVariable(process.env.API_AUTH_TITLE),
        };
    }

    public getLinkEnvironment(): IEnvironment {
        return {
            port: this.getNumberEnvironmentVariable(process.env.API_LINK_PORT),
            path: this.getStringEnvironmentVariable(process.env.API_LINK_PATH),
            apiTitle: this.getStringEnvironmentVariable(process.env.API_LINK_TITLE),
        };
    }

    //#endregion

    //#region Private methods

    private getStringEnvironmentVariable(variable?: string): string {
        if (!variable) {
            throw new CriticalServerError(ERROR_MESSAGE_API.DOT_ENV_VARIABLE_IS_UNDEFINED());
        }

        const STRING_ENVIRONMENT_VARIABLE: string = variable || '';

        if (!STRING_ENVIRONMENT_VARIABLE.length) {
            throw new CriticalServerError(ERROR_MESSAGE_API.NOT_DEFINED_DOT_ENV_VARIABLE(variable));
        }

        return STRING_ENVIRONMENT_VARIABLE;
    }

    private getNumberEnvironmentVariable(variable?: string): number {
        if (!variable) {
            throw new Error(ERROR_MESSAGE_API.DOT_ENV_VARIABLE_IS_UNDEFINED());
        }

        const NUMBER_ENVIRONMENT_VARIABLE: number = Number(variable) || 0;

        if (!NUMBER_ENVIRONMENT_VARIABLE || isNaN(NUMBER_ENVIRONMENT_VARIABLE)) {
            throw new Error(ERROR_MESSAGE_API.NOT_DEFINED_DOT_ENV_VARIABLE(variable));
        }

        return NUMBER_ENVIRONMENT_VARIABLE;
    }

    //#endregion
}
