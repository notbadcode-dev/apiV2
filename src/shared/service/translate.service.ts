import translate from '@app/app.translate';
import { ERROR_MESSAGE_API } from '@constant/error-message/error-message-api.constant';
import { REGEX } from '@constant/regex.constant';
import { DEFAULT_TRANSLATE_LOCATE } from '@constant/translate.constant';
import { Replacements } from 'i18n';
import { Service } from 'typedi';

@Service()
export class TranslationService {
    private static currentLocate: string = DEFAULT_TRANSLATE_LOCATE;

    static setLocale(locale: string): void {
        this.setCurrentLocale(locale);
        translate.setLocale(this.getCurrentLocale());
    }

    static translate(key: string | i18n.TranslateOptions): string {
        return translate.__(key);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static translateWithParameters(key: string, parameterList: string[]): string {
        TranslationService.controlNumberParametersAvailable(key, parameterList);

        const params: Replacements = TranslationService.generateParametersFromTextList(parameterList);
        return translate.__(key, params);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static generateParametersFromTextList(parameterList: string[]): any {
        const entries = parameterList.map((value: string, index: number) => {
            return [`${index}`, value.toString().trim().toLowerCase()];
        });
        const params = Object.fromEntries(entries);
        return params;
    }

    private static controlNumberParametersAvailable(key: string, parameterList: string[]): void {
        const match = this.translate(key).match(REGEX.TRANSLATE_KEY_PARAMETER);
        if (!match || match.length !== parameterList.length) {
            throw new Error(ERROR_MESSAGE_API.WRONG_NUMBER_OF_PARAMETERS(key, match?.length ?? 0, parameterList.length));
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
}

export default TranslationService;
