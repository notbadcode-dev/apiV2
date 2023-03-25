import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';

import { initializeListener, initializerApplication, initializerDependencies } from 'app';
import express from 'express';
import { INJECTED_DEPENDENCY } from 'shared/constant/injected-dependency.constant';

import { EXECUTE_HOOK_RUN_EVERY_ALL_DAYS_00H } from 'shared/constant/hook.constant';
import { authDataSource } from 'shared/database/auth.database';
import { initializeDataSource } from 'shared/database/database';
import { GlobalUtilEnvService } from 'shared/service/global/global.util.env.service';
import hookService from 'shared/service/hook.service';
import { LoggerService } from 'shared/service/logger.service';
import { authApiEntityList } from './domain/entity/_auth.entity.index';

function authExpressApp(): void {
    const app: express.Application = express();

    initializeDataSource(authDataSource);
    initializerApplication(app);

    const { port, path, apiTitle } = GlobalUtilEnvService.getAuthEnvironment();
    initializerDependencies(app, authDataSource, path, authApiEntityList, INJECTED_DEPENDENCY.AUTH_PATH);
    initializeListener(app, port, path, apiTitle);

    hookService.schedule(EXECUTE_HOOK_RUN_EVERY_ALL_DAYS_00H, () => {
        LoggerService.infoLogger('New day on ' + apiTitle);
    });
}

authExpressApp();
