import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';

import { initializeListener, initializerApplication, initializerDependencies } from 'app';
import { authApiEntityList } from 'authApi/domain/entity/_auth.entity.index';
import express from 'express';
import { INJECTED_DEPENDENCY } from 'shared/constant/injected-dependency.constant';
import { initializeDataSource } from 'shared/database/database';
import { linkDataSource } from 'shared/database/link.database';
import { GlobalUtilEnvService } from 'shared/service/global/global.util.env.service';
import { linkApiEntityList } from './domain/entity/_link.entity.index';

function linkExpressApp(): void {
    const app: express.Application = express();

    initializeDataSource(linkDataSource);
    initializerApplication(app);

    const { port, path, apiTitle } = GlobalUtilEnvService.getLinkEnvironment();
    initializerDependencies(app, linkDataSource, path, [...authApiEntityList, ...linkApiEntityList], INJECTED_DEPENDENCY.LINK_PATH);
    initializeListener(app, port, path, apiTitle);
}

linkExpressApp();
