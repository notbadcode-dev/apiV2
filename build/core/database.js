'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.dataSource = void 0;
const typeorm_1 = require('typeorm');
exports.dataSource = new typeorm_1.DataSource({
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    username: 'notbadcode',
    password: '6900',
    database: 'link',
    entities: ['src/entity/*.ts'],
    logging: true,
    dateStrings: true,
    trace: true,
    connectorPackage: 'mysql',
    logger: 'debug',
    maxQueryExecutionTime: 5,
    cache: {
        type: 'database',
        duration: 600000,
        ignoreErrors: true,
    },
});
