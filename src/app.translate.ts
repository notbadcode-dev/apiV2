import { DEFAULT_TRANSLATE_LOCATE, LOCALE_TRANSLATE_LOCATE_LIST } from '@constant/translate.constant';
import { LoggerService } from '@service/logger.service';
import * as translate from 'i18n';
import * as path from 'path';

const LOCALE_DIRECTORY = path.join(__dirname, '..', 'src/shared/i18n');
const LOGGER_SERVICE = new LoggerService();

translate.configure({
    locales: [...LOCALE_TRANSLATE_LOCATE_LIST],
    defaultLocale: DEFAULT_TRANSLATE_LOCATE,
    directory: LOCALE_DIRECTORY,
    objectNotation: true,
    retryInDefaultLocale: true,
    autoReload: false,
    updateFiles: false,
    syncFiles: false,
    extension: '.json',
    cookie: 'language',
    header: 'APP_LANGUAGE',
    api: {
        __: 'translate',
        __n: 'translateN',
    },
    logWarnFn: (msg: string) => LOGGER_SERVICE.warnLogger('Translate service - ' + msg),
    logErrorFn: (msg: string) => LOGGER_SERVICE.errorLogger('Translate service - ' + msg),
});

export default translate;
