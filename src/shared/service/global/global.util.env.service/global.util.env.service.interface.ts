import { IEnvironment } from '@model/environment/environment';
import { Algorithm } from 'jsonwebtoken';

export interface IGlobalUtilEnvService {
    getLoggingEnabled(): boolean;

    getSessionSecret(): string;

    getSessionExpiresIn(): string;

    getHashedAlgorithm(): Algorithm;

    getRunTest(): boolean;

    getAuthEnvironment(): IEnvironment;

    getLinkEnvironment(): IEnvironment;
}
