/* eslint-disable @typescript-eslint/ban-types */
import 'dotenv/config';
import 'express-async-errors';
import 'reflect-metadata';

import { HTTP_RESPONSE_STATUS } from '@constant/http.constant';
import { MESSAGE_API } from '@constant/message/message.api.constant';
import { ResponseInterceptor } from '@service/interceptor/response.interceptor';
import { ErrorMiddleware } from '@service/middleware/error.middleware';
import cors from 'cors';
import express, { Request } from 'express';
import path from 'path';
import { useContainer, useExpressServer } from 'routing-controllers';
import Container from 'typedi';

import { LoggerService } from '@service/logger.service';
import helmet from 'helmet';
import { DataSource } from 'typeorm';

function trustProxy(req: Request): void {
    const HEADERS = req.headers;

    if (HEADERS['x-forwarded-for']) {
        const FORWARDER_FOR = Array.isArray(HEADERS['x-forwarded-for'])
            ? HEADERS['x-forwarded-for'][0]
            : HEADERS['x-forwarded-for'].toString();
        req.ip = FORWARDER_FOR.split(',')[0];
    } else if (HEADERS['x-real-ip']) {
        const REAL_IP = Array.isArray(HEADERS['x-real-ip']) ? HEADERS['x-real-ip'][0] : HEADERS['x-real-ip'].toString();
        req.ip = REAL_IP.split(',')[0];
    }
}

function initializerExpressConfiguration(app: express.Application): void {
    app.use((req, res, next) => {
        trustProxy(req);
        next();
    });

    app.set('strict routing', true);
    app.disable('x-powered-by');
    app.use(helmet());

    app.use(express.json({ limit: '100kb' }));
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 }));
}

function initializerCorsConfiguration(app: express.Application): void {
    const CORS_OPTIONS = {
        origin: '*',
    };
    app.use(cors(CORS_OPTIONS));
}

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

    for (const ENTITY of entityList) {
        Container.set(ENTITY.name, dataSource.getRepository(ENTITY));
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

export function initializeListener(app: express.Application, port: number, apiPath: string, apiTitle: string): void {
    const LOGGER_SERVICE: LoggerService = new LoggerService();

    app.get(apiPath, (req, res) => {
        res.status(HTTP_RESPONSE_STATUS.SUCCESS).send(apiTitle || '');
    });

    app.use((req, res, next) => {
        LOGGER_SERVICE.requestLogger(req);
        next();
    });

    app.listen(port, () => {
        console.info();
        console.info(MESSAGE_API.CONSOLE_LINE);
        console.info('+          ' + MESSAGE_API.STARTED(apiTitle, port) + '          +');
        LOGGER_SERVICE.infoLogger(MESSAGE_API.STARTED(apiTitle, port));
    });
}
