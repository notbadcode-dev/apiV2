import { DataSource } from 'typeorm';
import { AUTH_API_ENTITY_LIST } from '../../authApi/domain/entity/_auth.entity.index';

export const AUTH_DATA_SOURCE = new DataSource({
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    username: 'notbadcode',
    password: '6900',
    database: 'auth',
    entities: [...AUTH_API_ENTITY_LIST],
    logging: true,
    dateStrings: true,
    trace: true,
    connectorPackage: 'mysql',
    logger: 'debug',
    maxQueryExecutionTime: 5,
    cache: {
        type: 'database',
        duration: 600000, // 10 minutes
        ignoreErrors: true,
    },
});
