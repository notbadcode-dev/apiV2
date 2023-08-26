import { ERROR_MESSAGE_API } from '@constant/error-message/error-message-api.constant';
import { GlobalUtilEnvService } from '@service/global/global.util.env.service/global.util.env.service';
import { IGlobalUtilEnvService } from '@service/global/global.util.env.service/global.util.env.service.interface';

//#region Attributes

let globalUtilEnvService: IGlobalUtilEnvService;

//#endregion

//#region Constructor

beforeEach(() => {
    globalUtilEnvService = new GlobalUtilEnvService();
});

//#endregion

describe('getLoggingEnabled', () => {
    it('returns true when LOGGING_ENABLED environment variable includes "true"', () => {
        process.env.LOGGING_ENABLED = 'true';

        const RESULT = globalUtilEnvService.getLoggingEnabled();

        expect(RESULT).toBe(true);
    });

    it('returns false when LOGGING_ENABLED environment variable does not include "true"', () => {
        process.env.LOGGING_ENABLED = 'false';

        const RESULT = globalUtilEnvService.getLoggingEnabled();

        expect(RESULT).toBe(false);
    });

    it('returns false when LOGGING_ENABLED environment variable is undefined', () => {
        delete process.env.LOGGING_ENABLED;

        const RESULT = globalUtilEnvService.getLoggingEnabled();

        expect(RESULT).toBe(false);
    });
});

describe('getSessionSecret', () => {
    it('returns the value of SESSION_SECRET environment variable', () => {
        process.env.SESSION_SECRET = 'mysecret';

        const RESULT = globalUtilEnvService.getSessionSecret();

        expect(RESULT).toBe('mysecret');
    });

    it('throws an error when SESSION_SECRET environment variable is undefined', () => {
        delete process.env.SESSION_SECRET;

        expect(() => globalUtilEnvService.getSessionSecret()).toThrowError(ERROR_MESSAGE_API.DOT_ENV_VARIABLE_IS_UNDEFINED());
    });
});

describe('getSessionExpiresIn', () => {
    it('returns the value of SESSION_EXPIRES_IN environment variable', () => {
        process.env.SESSION_EXPIRES_IN = '10m';

        const RESULT = globalUtilEnvService.getSessionExpiresIn();

        expect(RESULT).toBe('10m');
    });

    it('throws an error when SESSION_EXPIRES_IN environment variable is undefined', () => {
        delete process.env.SESSION_EXPIRES_IN;

        expect(() => globalUtilEnvService.getSessionExpiresIn()).toThrowError(ERROR_MESSAGE_API.DOT_ENV_VARIABLE_IS_UNDEFINED());
    });
});

describe('getRunTest', () => {
    it('returns true when RUN_TEST environment variable is "true"', () => {
        process.env.RUN_TEST = 'true';

        const RESULT = globalUtilEnvService.getRunTest();

        expect(RESULT).toBe(true);
    });

    it('returns false when RUN_TEST environment variable is not "true"', () => {
        process.env.RUN_TEST = 'false';

        const RESULT = globalUtilEnvService.getRunTest();

        expect(RESULT).toBe(false);
    });
});

describe('getAuthEnvironment', () => {
    it('returns an object with the properties port, path and apiTitle', () => {
        process.env.API_AUTH_PORT = '1234';
        process.env.API_AUTH_PATH = '/auth';
        process.env.API_AUTH_TITLE = 'Auth API';

        const RESULT = globalUtilEnvService.getAuthEnvironment();

        expect(RESULT).toEqual({ port: 1234, path: '/auth', apiTitle: 'Auth API' });
    });

    it('throws an error when API_AUTH_PORT environment variable is undefined', () => {
        delete process.env.API_AUTH_PORT;

        expect(() => globalUtilEnvService.getAuthEnvironment()).toThrowError(ERROR_MESSAGE_API.DOT_ENV_VARIABLE_IS_UNDEFINED());
    });

    it('throws an error when API_AUTH_PATH environment variable is undefined', () => {
        delete process.env.API_AUTH_PATH;

        expect(() => globalUtilEnvService.getAuthEnvironment()).toThrowError(ERROR_MESSAGE_API.DOT_ENV_VARIABLE_IS_UNDEFINED());
    });

    it('throws an error when API_AUTH_TITLE environment variable is undefined', () => {
        delete process.env.API_AUTH_TITLE;

        expect(() => globalUtilEnvService.getAuthEnvironment()).toThrowError(ERROR_MESSAGE_API.DOT_ENV_VARIABLE_IS_UNDEFINED());
    });
});

describe('getLinkEnvironment', () => {
    it('returns an object with the properties port, path and apiTitle', () => {
        process.env.API_LINK_PORT = '5678';
        process.env.API_LINK_PATH = '/link';
        process.env.API_LINK_TITLE = 'Link API';

        const RESULT = globalUtilEnvService.getLinkEnvironment();

        expect(RESULT).toEqual({ port: 5678, path: '/link', apiTitle: 'Link API' });
    });

    it('throws an error when API_LINK_PORT environment variable is undefined', () => {
        delete process.env.API_LINK_PORT;

        expect(() => globalUtilEnvService.getLinkEnvironment()).toThrowError(ERROR_MESSAGE_API.DOT_ENV_VARIABLE_IS_UNDEFINED());
    });

    it('throws an error when API_LINK_PATH environment variable is undefined', () => {
        delete process.env.API_LINK_PATH;

        expect(() => globalUtilEnvService.getLinkEnvironment()).toThrowError(ERROR_MESSAGE_API.DOT_ENV_VARIABLE_IS_UNDEFINED());
    });

    it('throws an error when API_LINK_TITLE environment variable is undefined', () => {
        delete process.env.API_LINK_TITLE;

        expect(() => globalUtilEnvService.getLinkEnvironment()).toThrowError(ERROR_MESSAGE_API.DOT_ENV_VARIABLE_IS_UNDEFINED());
    });
});
