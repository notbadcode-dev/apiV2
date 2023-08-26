import translate from '@app/app.translate';
import { ERROR_MESSAGE_API } from '@constant/error-message/error-message-api.constant';
import { REGEX } from '@constant/regex.constant';
import { DEFAULT_TRANSLATE_LOCATE } from '@constant/translate.constant';
import { InternalServerError } from '@error/internal-server.error';
import { GlobalUtilEnvService } from '@service/global/global.util.env.service/global.util.env.service';
import { LoggerService } from '@service/logger.service';
import * as fs from 'fs';
import { Replacements } from 'i18n';
import * as path from 'path';
import { Service } from 'typedi';

interface ITranslationsCache {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

@Service()
export class TranslationService {
    //#region Attributes

    private static translationsCache: ITranslationsCache = {};

    private static currentLocate: string = DEFAULT_TRANSLATE_LOCATE;

    private static loggerService: LoggerService = new LoggerService();

    private static globalUtilEnvService: GlobalUtilEnvService = new GlobalUtilEnvService();

    //#endregion

    //#region Public methods

    public static setLocale(locale: string): void {
        this.setCurrentLocale(locale);
        translate.setLocale(this.getCurrentLocale());
    }

    public static translationKeyExists(key: string): boolean {
        const LOGGING_ENABLE: boolean = this.globalUtilEnvService.getLoggingEnabled();
        if (LOGGING_ENABLE) {
            return true;
        }

        const LANGUAGE = translate.getLocale();
        const LOCALE_DIRECTORY = path.join(__dirname, '..', 'src/shared/i18n');
        const LOCALE_FILE = path.join(LOCALE_DIRECTORY, LANGUAGE + '.json');

        try {
            let translations;
            if (Object.prototype.hasOwnProperty.call(TranslationService.translationsCache, LOCALE_FILE)) {
                translations = TranslationService.translationsCache[LOCALE_FILE];
            } else {
                const TRANSLATE_FILE_DATA = fs.readFileSync(LOCALE_FILE, 'utf8');
                translations = JSON.parse(TRANSLATE_FILE_DATA);
                TranslationService.translationsCache[LOCALE_FILE] = translations;
            }
            const EXISTS_TRANSLATION: boolean = Object.prototype.hasOwnProperty.call(translations, key);

            if (!EXISTS_TRANSLATION) {
                this.loggerService.errorLogger('NOT EXIST TRANSLATION - ' + key);
            }

            return EXISTS_TRANSLATION;
        } catch (err) {
            if (!this.globalUtilEnvService.getRunTest()) {
                this.loggerService.errorLogger('NOT READ FILE TRANSLATION - ' + LANGUAGE);
            }
            return false;
        }
    }

    public static translate(key: string | i18n.TranslateOptions): string {
        if (this.translationKeyExists(key.toString())) {
            return translate.__(key);
        }

        return key.toString();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static translateWithParameters(key: string, parameterList: string[]): string {
        TranslationService.controlNumberParametersAvailable(key, parameterList);

        const PARAMETERS: Replacements = TranslationService.generateParametersFromTextList(parameterList);
        const TRANSLATED: string = translate.__mf(key, { ...PARAMETERS });
        return TRANSLATED;
    }

    //#endregion

    //#region Private methods

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static generateParametersFromTextList(parameterList: string[]): any {
        const ENTRIES = parameterList.map((value: string, index: number) => {
            return [`${index}`, value.toString().trim().toLowerCase()];
        });
        const PARAMETERS = Object.fromEntries(ENTRIES);
        return PARAMETERS;
    }

    private static controlNumberParametersAvailable(key: string, parameterList: string[]): void {
        const TRANSLATED: string = translate.__(key);
        const REGEX_PARAMETERS = REGEX.TRANSLATE_KEY_PARAMETER;
        const MATCH = TRANSLATED.match(REGEX_PARAMETERS);
        if (!MATCH || MATCH.length !== parameterList.length) {
            const PARAMETERS: Replacements = TranslationService.generateParametersFromTextList(parameterList);
            throw new InternalServerError(translate.__(ERROR_MESSAGE_API.WRONG_NUMBER_OF_PARAMETERS, PARAMETERS));
        }
    }

    private static getCurrentLocale(): string {
        return this.currentLocate;
    }

    private static setCurrentLocale(locale: string): void {
        if (!translate.getLocales().includes(locale)) {
            this.currentLocate = locale;
        }

        this.currentLocate = locale;
    }

    //#endregion
}

export default TranslationService;
