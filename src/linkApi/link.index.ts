import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';

import { initializeListener, initializerApplication, initializerDependencies } from '@app/app';
import { INJECTED_DEPENDENCY } from '@constant/injected-dependency.constant';
import { initializeDataSource } from '@database/database';
import { LINK_DATA_SOURCE } from '@database/link.database';
import { AUTH_API_ENTITY_LIST } from '@entity/_auth.entity.index';
import { GlobalUtilEnvService } from '@service/global/global.util.env.service';
import express from 'express/index';
import { linkApiEntityList } from './domain/entity/_link.entity.index';

function linkExpressApp(): void {
    const APP: express.Application = express();

    initializeDataSource(LINK_DATA_SOURCE);
    initializerApplication(APP);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { port, path, apiTitle } = GlobalUtilEnvService.getLinkEnvironment();
    initializerDependencies(APP, LINK_DATA_SOURCE, path, [...AUTH_API_ENTITY_LIST, ...linkApiEntityList], INJECTED_DEPENDENCY.LINK_PATH);
    initializeListener(APP, port, path, apiTitle);
}

linkExpressApp();
