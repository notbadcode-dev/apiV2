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

function trustProxy(req: Request): void {
    const headers = req.headers;

    if (headers['x-forwarded-for']) {
        const forwardedFor = Array.isArray(headers['x-forwarded-for'])
            ? headers['x-forwarded-for'][0]
            : headers['x-forwarded-for'].toString();
        req.ip = forwardedFor.split(',')[0];
    } else if (headers['x-real-ip']) {
        const realIp = Array.isArray(headers['x-real-ip']) ? headers['x-real-ip'][0] : headers['x-real-ip'].toString();
        req.ip = realIp.split(',')[0];
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
    const corsOptions = {
        origin: '*',
    };
    app.use(cors(corsOptions));
}

export function initializeListener(app: express.Application, port: number, path: string, apiTitle: string): void {
    const loggerService: LoggerService = new LoggerService();

    app.get(path, (req, res) => {
        res.status(HTTP_RESPONSE_STATUS.SUCCESS).send(apiTitle || '');
    });

    app.use((req, res, next) => {
        loggerService.requestLogger(req);
        next();
    });

    app.listen(port, () => {
        console.info();
        console.info(MESSAGE_API.CONSOLE_LINE);
        console.info('+          ' + MESSAGE_API.STARTED(apiTitle, port) + '          +');
        loggerService.infoLogger(MESSAGE_API.STARTED(apiTitle, port));
    });
}
