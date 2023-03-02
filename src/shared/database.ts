import { ApplicationEntity } from 'authApi/domain/entity/application.entity';
import { UserApplicationEntity } from 'authApi/domain/entity/user-application.entity';
import { DataSource } from 'typeorm';

import { UserEntity } from '../authApi/domain/entity/user.entity';
import { ERROR_MESSAGE_API } from './constant/error-message/error-message-api.constant';
import { MESSAGE_API } from './constant/message/message.api.constant';

export const dataSource = new DataSource({
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    username: 'notbadcode',
    password: '6900',
    database: 'auth',
    entities: [UserEntity, ApplicationEntity, UserApplicationEntity],
    logging: true,
    dateStrings: true,
    trace: true,
    connectorPackage: 'mysql',
    logger: 'debug',
    maxQueryExecutionTime: 5,
    synchronize: true,
    cache: {
        type: 'database',
        duration: 600000, // 10 minutes
        ignoreErrors: true,
    },
});

export function initializeDataSource(): void {
    const DATABASE_NAME: string = dataSource.options.database?.toString() || '';

    dataSource
        .initialize()
        .then(() => {
            console.info(MESSAGE_API.CONSOLE_LINE);
            console.info('+  ' + MESSAGE_API.DATA_SOURCE_INITIALIZED(DATABASE_NAME) + '  +');
            console.info(MESSAGE_API.CONSOLE_LINE);
            console.info();
        })
        .catch((err) => {
            console.error(ERROR_MESSAGE_API.ERROR_DATABASE_INITIALIZATION(DATABASE_NAME), err);
            throw new Error(ERROR_MESSAGE_API.ERROR_DATABASE_INITIALIZATION(DATABASE_NAME));
        });
}
