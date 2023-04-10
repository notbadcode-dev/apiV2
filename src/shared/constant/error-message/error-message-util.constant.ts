import TranslationService from '@service/translate.service';

export const ERROR_MESSAGE_UTIL = {
    INVALID_NUMBER_CONVERSION: 'error_message.util_number.invalid_number_conversion',
    NOT_MATCH_PARAM_ID_BODY_ID: 'error_message.util_number.not_match_param_id_body_id',
    VALUES_NOT_SAME_TYPE: 'error_message.util_number.values_not_same_type',
    PARSED_VALUE_IS_NAN: (value: string): string => {
        return TranslationService.translateWithParameters('error_message.util_number.parsed_value_is_nan', [value]);
    },
};
