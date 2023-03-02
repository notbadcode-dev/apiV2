import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';

import { initializeListener, initializerApplication, initializerDependencies } from 'app';
import express from 'express';
import { INJECTED_DEPENDENCY } from 'shared/constant/injected-dependency.constant';
import { initializeDataSource } from 'shared/database';

import { GlobalUtilEnvService } from 'shared/service/global/global.util.env.service';
import { authApiEntityList } from './domain/entity/_auth.entity.index';

function authExpressApp(): void {
    const app: express.Application = express();

    initializeDataSource();
    initializerApplication(app);
    initializerDependencies(app, authApiEntityList, INJECTED_DEPENDENCY.AUTH_PATH);

    const { port, path, apiTitle } = GlobalUtilEnvService.getAuthEnvironment();
    initializeListener(app, port, path, apiTitle);
}

authExpressApp();
