import { IEnvironment } from 'shared/model/environment/environment';
import { Service } from 'typedi';

import { ERROR_MESSAGE_API } from '../../constant/error-message/error-message-api.constant';

@Service()
export class GlobalUtilEnvService {
    public static getAuthEnvironment(): IEnvironment {
        return {
            port: this.getNumberEnvironmentVariable(process.env.API_AUTH_PORT),
            path: this.getStringEnvironmentVariable(process.env.API_AUTH_PATH),
            apiTitle: this.getStringEnvironmentVariable(process.env.API_AUTH_TITLE),
        };
    }

    public static getLinkEnvironment(): IEnvironment {
        return {
            port: this.getNumberEnvironmentVariable(process.env.API_LINK_PORT),
            path: this.getStringEnvironmentVariable(process.env.API_LINK_PATH),
            apiTitle: this.getStringEnvironmentVariable(process.env.API_LINK_TITLE),
        };
    }

    private static getStringEnvironmentVariable(variable?: string): string {
        if (!variable) {
            throw new Error(ERROR_MESSAGE_API.DOT_ENV_VARIABLE_IS_UNDEFINED());
        }

        const STRING_ENVIRONMENT_VARIABLE: string = variable || '';

        if (!STRING_ENVIRONMENT_VARIABLE.length) {
            throw new Error(ERROR_MESSAGE_API.NOT_DEFINED_DOT_ENV_VARIABLE(variable));
        }

        return STRING_ENVIRONMENT_VARIABLE;
    }

    private static getNumberEnvironmentVariable(variable?: string): number {
        if (!variable) {
            throw new Error(ERROR_MESSAGE_API.DOT_ENV_VARIABLE_IS_UNDEFINED());
        }

        const NUMBER_ENVIRONMENT_VARIABLE: number = Number(variable) || 0;

        if (!NUMBER_ENVIRONMENT_VARIABLE || isNaN(NUMBER_ENVIRONMENT_VARIABLE)) {
            throw new Error(ERROR_MESSAGE_API.NOT_DEFINED_DOT_ENV_VARIABLE(variable));
        }

        return NUMBER_ENVIRONMENT_VARIABLE;
    }
}
