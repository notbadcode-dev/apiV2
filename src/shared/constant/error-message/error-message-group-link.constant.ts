import TranslationService from 'shared/service/translate.service';

export const ERROR_MESSAGE_GROUP_LINK = {
    GROUP_LINK_WITH_ID_NOT_FOUND: (groupLinkId: number): string => {
        return TranslationService.translateWithParameters('error_message.group_link.group_link_with_id_not_found', [
            groupLinkId.toString(),
        ]);
    },
};
