import { authApiEntityList } from '@entity/_auth.entity.index';
import { DataSource } from 'typeorm';

import { linkApiEntityList } from '../../@entity/_link.entity.index';

export const linkDataSource = new DataSource({
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    username: 'notbadcode',
    password: '6900',
    database: 'link',
    entities: [...authApiEntityList, ...linkApiEntityList],
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
