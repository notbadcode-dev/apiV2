import { ERROR_MESSAGE_TAG } from '@constant/error-message/error-message-tag.constant';
import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { TagEntity } from '@entity/tag.entity';
import { ArgumentError } from '@error/argument.error';
import { InternalServerError } from '@error/internal-server.error';
import { ITagCreate } from '@model/tag/tag-create.model';
import { ITag } from '@model/tag/tag.model';

export class TagServiceTestData {
    //#region Public methods

    //#region return TagEntity

    public getTagEntity(): TagEntity {
        const GROUP_LINK_ENTITY = new TagEntity();
        GROUP_LINK_ENTITY.id = 1;
        GROUP_LINK_ENTITY.name = 'Test Tag';
        GROUP_LINK_ENTITY.linkId = 1;
        return GROUP_LINK_ENTITY;
    }

    //#endregion

    //#region return ITagCreate

    public getTagCreate(): ITagCreate {
        return {
            name: 'Test Tag',
            linkId: 1,
        };
    }

    public getTagCreateWithEmptyName(): ITagCreate {
        return {
            ...this.getTagCreate(),
            name: '',
        };
    }

    public getTagCreateWithLinkIdIsZero(): ITagCreate {
        return {
            ...this.getTagCreate(),
            linkId: 0,
        };
    }

    public getTagCreateWithLinkIdIsNull(): ITagCreate {
        return {
            ...this.getTagCreate(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            linkId: null as any,
        };
    }

    //#endregion

    //#region return ITag

    public getTag(): ITag {
        return {
            ...this.getTagCreateWithEmptyName(),
            id: 1,
        };
    }

    //#endregion

    //#region return throw exception

    public getArgumentErrorEmptyTagName(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_TAG.WRONG_NAME_ARGUMENT);
    }

    public getArgumentErrorWrongId(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_TAG.WRONG_ID_ARGUMENT);
    }

    public getArgumentErrorWrongLinkId(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_TAG.WRONG_LINK_ID_ARGUMENT);
    }

    public getInternalServerErrorNotMatchParamAndBodyId(): InternalServerError {
        return new InternalServerError(ERROR_MESSAGE_UTIL.NOT_MATCH_PARAM_ID_BODY_ID);
    }

    //#endregion

    //#endregion
}
