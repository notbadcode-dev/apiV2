import TranslationService from '@service/translate.service';

export const ERROR_MESSAGE_GROUP_LINK = {
    GROUP_LINK_WITH_ID_NOT_FOUND: (groupLinkId: number): string => {
        return TranslationService.translateWithParameters('error_message.group_link.group_link_with_id_not_found', [
            groupLinkId.toString(),
        ]);
    },
    WRONG_NAME_ARGUMENT: 'error_message.group_link.wrong_name_argument',
    WRONG_ID_ARGUMENT: 'error_message.group_link.wrong_id_argument',
    COULD_NOT_CREATED_GROUP_LINK_WITH_NAME: (groupLinkName: string): string => {
        return TranslationService.translateWithParameters('error_message.link.could_not_create_group_link', [groupLinkName.trim()]);
    },
    COULD_NOT_UPDATE_GROUP_LINK: (groupLinkName: string): string => {
        return TranslationService.translateWithParameters('error_message.link.could_not_update_group_link', [groupLinkName.trim()]);
    },
    COULD_NOT_DELETE_GROUP_LINK: (groupLinkName: string): string => {
        return TranslationService.translateWithParameters('error_message.link.could_not_delete_group_link', [groupLinkName.trim()]);
    },
};
