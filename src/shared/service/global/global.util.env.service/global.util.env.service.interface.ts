import { IEnvironment } from '@model/environment/environment';

export interface IGlobalUtilEnvService {
    getLoggingEnabled(): boolean;

    getSessionSecret(): string;

    getSessionExpiresIn(): string;

    getRunTest(): boolean;

    getAuthEnvironment(): IEnvironment;

    getLinkEnvironment(): IEnvironment;
}
