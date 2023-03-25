/* eslint-disable @typescript-eslint/ban-types */
import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';

import cors from 'cors';
import express from 'express';
import path from 'path';
import { useContainer, useExpressServer } from 'routing-controllers';
import { HTTP_RESPONSE_STATUS } from 'shared/constant/http.constant';
import { MESSAGE_API } from 'shared/constant/message/message.api.constant';
import { ResponseInterceptor } from 'shared/service/interceptor/response.interceptor';
import { ErrorMiddleware } from 'shared/service/middleware/error.middleware';
import Container from 'typedi';

import helmet from 'helmet';
import { LoggerService } from 'shared/service/logger.service';
import { DataSource } from 'typeorm';

export function initializerApplication(app: express.Application): void {
    initializerExpressConfiguration(app);
    initializerCorsConfiguration(app);
}

export function initializerDependencies(
    app: express.Application,
    dataSource: DataSource,
    routePrefix: string,
    entityList: Function[],
    controllerPath: string,
    middlewareList: Function[] = new Array<Function>(),
    interceptorList: Function[] = new Array<Function>()
): void {
    useContainer(Container);

    for (const entity of entityList) {
        Container.set(entity.name, dataSource.getRepository(entity));
    }

    Container.set(DataSource, dataSource);

    useExpressServer(app, {
        routePrefix: routePrefix,
        controllers: [__dirname + controllerPath],
        middlewares: [ErrorMiddleware, ...middlewareList],
        interceptors: [ResponseInterceptor, ...interceptorList],
        defaultErrorHandler: false,
    });
}

function initializerExpressConfiguration(app: express.Application): void {
    app.set('strict routing', true);
    app.disable('x-powered-by');
    app.use(helmet());

    app.use(express.json({ limit: '100kb' }));
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 }));
}

function initializerCorsConfiguration(app: express.Application): void {
    const corsOptions = {
        origin: '*',
    };
    app.use(cors(corsOptions));
}

export function initializeListener(app: express.Application, port: number, path: string, apiTitle: string): void {
    app.get(path, (req, res) => {
        res.status(HTTP_RESPONSE_STATUS.SUCCESS).send(apiTitle || '');
    });

    app.use((req, res, next) => {
        LoggerService.requestLogger(req);
        next();
    });

    app.listen(port, () => {
        console.info();
        console.info(MESSAGE_API.CONSOLE_LINE);
        console.info('+          ' + MESSAGE_API.STARTED(apiTitle, port) + '          +');
        LoggerService.infoLogger(MESSAGE_API.STARTED(apiTitle, port));
    });
}
