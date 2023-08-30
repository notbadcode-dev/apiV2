import TranslationService from '@service/translate.service';

export const ERROR_MESSAGE_TAG = {
    TAG_WITH_ID_NOT_FOUND: (linkTagId: number): string => {
        return TranslationService.translateWithParameters('error_message.tag.tag_with_id_not_found', [linkTagId.toString()]);
    },
    WRONG_NAME_ARGUMENT: 'error_message.tag.wrong_name_argument',
    WRONG_ID_ARGUMENT: 'error_message.tag.wrong_id_argument',
    WRONG_LINK_ID_ARGUMENT: 'error_message.tag.wrong_link_id_argument',
    COULD_NOT_CREATED_TAG_WITH_NAME: (tagName: string): string => {
        return TranslationService.translateWithParameters('error_message.tag.could_not_create_tag', [tagName.trim()]);
    },
    COULD_NOT_UPDATE_TAG: (tagName: string): string => {
        return TranslationService.translateWithParameters('error_message.tag.could_not_update_tag', [tagName.trim()]);
    },
    COULD_NOT_DELETE_TAG: (tagName: string): string => {
        return TranslationService.translateWithParameters('error_message.tag.could_not_delete_tag', [tagName.trim()]);
    },
};
