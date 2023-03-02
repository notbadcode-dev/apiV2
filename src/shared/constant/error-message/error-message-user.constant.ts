import TranslationService from 'shared/service/translate.service';

export const ERROR_MESSAGE_USER = {
    ALREADY_EXIST_USER_SAME_USERNAME: TranslationService.translate('error_message.user.already_exist_user_same_password'),
    COULD_NOT_CREATED_USER_WITH_USERNAME: (username: string): string => {
        return TranslationService.translateWithParameters('error_message.user.could_not_created_user_with_username', [username.toString()]);
    },
    USER_WITH_ID_NOT_FOUND: (userId: number): string => {
        return TranslationService.translateWithParameters('error_message.user.user_with_id_not_found', [userId.toString()]);
    },
    USER_WITH_USERNAME_NOT_FOUND: (username: string): string => {
        return TranslationService.translateWithParameters('error_message.user.user_with_username_not_found', [username]);
    },
    COULD_NOT_UPDATE_USER: (username: string): string => {
        return TranslationService.translateWithParameters('error_message.user.could_not_update_user', [username]);
    },
};
