import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';

import { initializeListener, initializerApplication, initializerDependencies } from '@app/app';
import { INJECTED_DEPENDENCY } from '@constant/injected-dependency.constant';
import { initializeDataSource } from '@database/database';
import { LINK_DATA_SOURCE } from '@database/link.database';
import { AUTH_API_ENTITY_LIST } from '@entity/_auth.entity.index';
import { GLOBAL_UTIL_ENV_SERVICE_TOKEN } from '@service/global/global.util.env.service/global.util.env.service';
import express from 'express/index';
import Container from 'typedi';
import { linkApiEntityList } from './domain/entity/_link.entity.index';

function linkExpressApp(): void {
    const APP: express.Application = express();

    initializeDataSource(LINK_DATA_SOURCE);
    initializerApplication(APP);

    const GLOBAL_UTIL_ENV_SERVICE = Container.get(GLOBAL_UTIL_ENV_SERVICE_TOKEN);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { port, path, apiTitle } = GLOBAL_UTIL_ENV_SERVICE.getLinkEnvironment();
    initializerDependencies(APP, LINK_DATA_SOURCE, path, [...AUTH_API_ENTITY_LIST, ...linkApiEntityList], INJECTED_DEPENDENCY.LINK_PATH);
    initializeListener(APP, port, path, apiTitle);
}

linkExpressApp();
