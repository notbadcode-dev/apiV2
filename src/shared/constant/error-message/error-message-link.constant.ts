import TranslationService from 'shared/service/translate.service';

export const ERROR_MESSAGE_LINK = {
    COULD_NOT_CREATED_LINK_WITH_NAME: (name: string): string => {
        return TranslationService.translateWithParameters('error_message.link.could_not_created_link_with_name', [name.toString()]);
    },
    LINK_WITH_ID_NOT_FOUND: (linkId: number): string => {
        return TranslationService.translateWithParameters('error_message.user.link_with_id_not_found', [linkId.toString()]);
    },
    WRONG_NAME_ARGUMENT: 'error_message.link.wrong_name_argument',
    WRONG_URL_ARGUMENT: 'error_message.link.wrong_url_argument',
};
