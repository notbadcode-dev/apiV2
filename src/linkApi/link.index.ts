import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';

import { initializeListener, initializerApplication, initializerDependencies } from '@app/app';
import { INJECTED_DEPENDENCY } from '@constant/injected-dependency.constant';
import { initializeDataSource } from '@database/database';
import { linkDataSource } from '@database/link.database';
import { authApiEntityList } from '@entity/_auth.entity.index';
import { GlobalUtilEnvService } from '@service/global/global.util.env.service';
import express from 'express/index';
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
