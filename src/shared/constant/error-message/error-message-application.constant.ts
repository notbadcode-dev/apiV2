import TranslationService from 'shared/service/translate.service';

export const ERROR_MESSAGE_APPLICATION = {
    THERE_IS_NOT_APPLICATION_WITH_ID: (applicationId: number): string => {
        return TranslationService.translateWithParameters('error_message.application.there_is_not_application_with_id', [
            applicationId.toString(),
        ]);
    },
    APPLICATION_WITH_ID_NOT_FOUND: (applicationId: number): string => {
        return TranslationService.translateWithParameters('error_message.application.application_with_id_not_found', [
            applicationId.toString(),
        ]);
    },
    COULD_NOT_ASSOCIATE_APPLICATION_AND_USER: (applicationId: number, username: string): string => {
        return TranslationService.translateWithParameters('error_message.application.could_not_associate_application_and_user', [
            applicationId.toString(),
            username,
        ]);
    },
};
