import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';

import { initializeListener, initializerApplication, initializerDependencies } from '@app/app';
import { INJECTED_DEPENDENCY } from '@constant/injected-dependency.constant';
import express from 'express/index';

import { AUTH_API_ENTITY_LIST } from '@app/authApi/domain/entity/_auth.entity.index';
import { AUTH_DATA_SOURCE } from '@app/shared/database/auth.database';
import { initializeDataSource } from '@app/shared/database/database';
import { EXECUTE_HOOK_RUN_EVERY_ALL_DAYS_00H } from '@constant/hook.constant';
import { GLOBAL_UTIL_ENV_SERVICE_TOKEN } from '@service/global/global.util.env.service/global.util.env.service';
import hookService from '@service/hook.service';
import { LoggerService } from '@service/logger.service';
import Container from 'typedi';

const LOGGER_SERVICE: LoggerService = new LoggerService();

function authExpressApp(): void {
    const APP: express.Application = express();

    initializeDataSource(AUTH_DATA_SOURCE);
    initializerApplication(APP);

    const GLOBAL_UTIL_ENV_SERVICE = Container.get(GLOBAL_UTIL_ENV_SERVICE_TOKEN);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { port, path, apiTitle } = GLOBAL_UTIL_ENV_SERVICE.getAuthEnvironment();
    initializerDependencies(APP, AUTH_DATA_SOURCE, path, AUTH_API_ENTITY_LIST, INJECTED_DEPENDENCY.AUTH_PATH);
    initializeListener(APP, port, path, apiTitle);

    hookService.schedule(EXECUTE_HOOK_RUN_EVERY_ALL_DAYS_00H, () => {
        LOGGER_SERVICE.infoLogger('New day on ' + apiTitle);
    });
}

authExpressApp();
