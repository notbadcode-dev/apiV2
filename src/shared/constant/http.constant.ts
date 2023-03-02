import { EHttpResponseMessageType } from 'shared/enum/http-response-message.enum';
import TranslationService from 'shared/service/translate.service';

export const HTTP_RESPONSE_STATUS = {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    ALREADY_EXISTS: 409,
    INTERNAL_SERVER_ERROR: 500,
    CRITICAL_SERVER_ERROR: 503,
};

export const HTTP_RESPONSE_MESSAGE = {
    [HTTP_RESPONSE_STATUS.SUCCESS]: TranslationService.translate('error_message.http.success'),
    [HTTP_RESPONSE_STATUS.CREATED]: TranslationService.translate('error_message.http.created'),
    [HTTP_RESPONSE_STATUS.NO_CONTENT]: TranslationService.translate('error_message.http.no_content'),
    [HTTP_RESPONSE_STATUS.BAD_REQUEST]: TranslationService.translate('error_message.http.bad_request'),
    [HTTP_RESPONSE_STATUS.UNAUTHORIZED]: TranslationService.translate('error_message.http.Unauthorized'),
    [HTTP_RESPONSE_STATUS.FORBIDDEN]: TranslationService.translate('error_message.http.Forbidden'),
    [HTTP_RESPONSE_STATUS.NOT_FOUND]: TranslationService.translate('error_message.http.not_found'),
    [HTTP_RESPONSE_STATUS.ALREADY_EXISTS]: TranslationService.translate('error_message.http.already_exists'),
    [HTTP_RESPONSE_STATUS.INTERNAL_SERVER_ERROR]: TranslationService.translate('error_message.http.internal_server_error'),
    [HTTP_RESPONSE_STATUS.CRITICAL_SERVER_ERROR]: TranslationService.translate('error_message.http.critical_server_error'),
};

export const HTTP_RESPONSE_MESSAGE_TYPE = {
    [HTTP_RESPONSE_STATUS.SUCCESS]: EHttpResponseMessageType.success,
    [HTTP_RESPONSE_STATUS.CREATED]: EHttpResponseMessageType.success,
    [HTTP_RESPONSE_STATUS.NO_CONTENT]: EHttpResponseMessageType.error,
    [HTTP_RESPONSE_STATUS.BAD_REQUEST]: EHttpResponseMessageType.error,
    [HTTP_RESPONSE_STATUS.UNAUTHORIZED]: EHttpResponseMessageType.error,
    [HTTP_RESPONSE_STATUS.FORBIDDEN]: EHttpResponseMessageType.error,
    [HTTP_RESPONSE_STATUS.NOT_FOUND]: EHttpResponseMessageType.warning,
    [HTTP_RESPONSE_STATUS.ALREADY_EXISTS]: EHttpResponseMessageType.warning,
    [HTTP_RESPONSE_STATUS.INTERNAL_SERVER_ERROR]: EHttpResponseMessageType.error,
    [HTTP_RESPONSE_STATUS.CRITICAL_SERVER_ERROR]: EHttpResponseMessageType.critical,
};
