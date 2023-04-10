import TranslationService from '@service/translate.service';

export const ERROR_MESSAGE_PASSWORD = {
    FAILED_TO_ENCRYPT_PASSWORD: TranslationService.translate('error_message.password.failed_encrypt'),
    FAILED_TO_VERIFY_PASSWORD: TranslationService.translate('error_message.password.failed_verify'),
};
