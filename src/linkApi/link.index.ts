import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';

import { initializeListener, initializerApplication, initializerDependencies } from 'app';
import express from 'express';
import { INJECTED_DEPENDENCY } from 'shared/constant/injected-dependency.constant';
import { initializeDataSource } from 'shared/database';
import { GlobalUtilEnvService } from 'shared/service/global/global.util.env.service';
import { linkApiEntityList } from './domain/entity/_link.entity.index';

function linkExpressApp(): void {
    const app: express.Application = express();

    initializeDataSource();
    initializerApplication(app);
    initializerDependencies(app, linkApiEntityList, INJECTED_DEPENDENCY.AUTH_PATH);

    const { port, path, apiTitle } = GlobalUtilEnvService.getLinkEnvironment();
    initializeListener(app, port, path, apiTitle);
}

linkExpressApp();
