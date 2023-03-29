import { DEFAULT_TRANSLATE_LOCATE, LOCALE_TRANSLATE_LOCATE_LIST } from '@constant/translate.constant';
import * as translate from 'i18n';
import * as path from 'path';

const localesDirectory = path.join(__dirname, '..', 'src/shared/i18n');

translate.configure({
    locales: [...LOCALE_TRANSLATE_LOCATE_LIST],
    defaultLocale: DEFAULT_TRANSLATE_LOCATE,
    directory: localesDirectory,
    objectNotation: true,
    api: {
        __: 'translate',
        __n: 'translateN',
    },
});

export default translate;
