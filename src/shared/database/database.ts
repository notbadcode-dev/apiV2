import { ERROR_MESSAGE_API } from '@constant/error-message/error-message-api.constant';
import { MESSAGE_API } from '@constant/message/message.api.constant';
import { DataSource } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/ban-types
export function initializeDataSource(dataSource: DataSource): void {
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
