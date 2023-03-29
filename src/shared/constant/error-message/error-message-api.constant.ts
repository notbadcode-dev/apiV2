import TranslationService from '@service/translate.service';

export const ERROR_MESSAGE_API = {
    DOT_ENV_VARIABLE_IS_UNDEFINED: (): string => {
        return TranslationService.translate('error_message.api.dot_env_variable_undefined');
    },
    NOT_DEFINED_DOT_ENV_VARIABLE: (environmentVariableCode: string): string => {
        return TranslationService.translateWithParameters('error_message.api.not_defined_env_variable', [environmentVariableCode]);
    },
    ERROR_DATABASE_INITIALIZATION: (databaseName: string): string => {
        return TranslationService.translateWithParameters('error_message.api.error_database_initialization', [databaseName]);
    },
    WRONG_NUMBER_OF_PARAMETERS: (key: string, matchLength: number, parametersLength: number): string => {
        return TranslationService.translateWithParameters('error_message.translate.wrong_number_of_parameters', [
            key,
            matchLength.toString(),
            parametersLength.toString(),
        ]);
    },
};
