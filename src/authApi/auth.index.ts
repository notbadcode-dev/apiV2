import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';

import { initializeListener, initializerApplication, initializerDependencies } from '@app/app';
import { INJECTED_DEPENDENCY } from '@constant/injected-dependency.constant';
import express from 'express/index';

import { EXECUTE_HOOK_RUN_EVERY_ALL_DAYS_00H } from '@constant/hook.constant';
import { GlobalUtilEnvService } from '@service/global/global.util.env.service';
import hookService from '@service/hook.service';
import { LoggerService } from '@service/logger.service';
import { authDataSource } from '../../src/shared/database/auth.database';
import { initializeDataSource } from '../../src/shared/database/database';
import { authApiEntityList } from './domain/entity/_auth.entity.index';

const loggerService: LoggerService = new LoggerService();

function authExpressApp(): void {
    const app: express.Application = express();

    initializeDataSource(authDataSource);
    initializerApplication(app);

    const { port, path, apiTitle } = GlobalUtilEnvService.getAuthEnvironment();
    initializerDependencies(app, authDataSource, path, authApiEntityList, INJECTED_DEPENDENCY.AUTH_PATH);
    initializeListener(app, port, path, apiTitle);

    hookService.schedule(EXECUTE_HOOK_RUN_EVERY_ALL_DAYS_00H, () => {
        loggerService.infoLogger('New day on ' + apiTitle);
    });
}

authExpressApp();
