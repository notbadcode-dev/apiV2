import TranslationService from '@service/translate.service';

export const ERROR_MESSAGE_LINK_TAG = {
    LINK_TAG_WITH_ID_NOT_FOUND: (linkTagId: number): string => {
        return TranslationService.translateWithParameters('error_message.link_tag.link_tag_with_id_not_found', [linkTagId.toString()]);
    },
};
