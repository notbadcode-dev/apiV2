import { ERROR_MESSAGE_LINK } from '@constant/error-message/error-message-link.constant';
import { LinkEntity } from '@entity/link.entity';
import { ArgumentError } from '@error/argument.error';
import { ILinkCreate } from '@model/link/link-create.model';
import { ILink } from '@model/link/link.model';

export class LinkServiceTestData {
    getLinkCreate(): ILinkCreate {
        return {
            name: 'Test',
            url: 'http://www.test.com',
        };
    }

    getLink(): ILink {
        return {
            id: 1,
            name: 'Test',
            url: 'http://www.test.com',
        };
    }

    getLinkEntity(): LinkEntity {
        return {
            id: 1,
            name: 'Test',
            url: 'http://www.test.com',
            favorite: false,
            active: true,
            userId: this.getUserId(),
        };
    }

    getLinkWithEmptyName(): ILink {
        return {
            ...this.getLink(),
            name: '',
        };
    }

    getLinkWithZeroId(): ILink {
        return {
            ...this.getLink(),
            id: 0,
        };
    }

    getLinkWithNullishId(): ILink {
        return {
            ...this.getLink(),
            id: Number(null),
        };
    }

    getLinkWithEmptyUrl(): ILink {
        return {
            ...this.getLink(),
            url: '',
        };
    }

    getLinkCreateWithEmptyName(): ILinkCreate {
        return {
            ...this.getLinkCreate(),
            name: '',
        };
    }

    getLinkCreateWithEmptyUrl(): ILinkCreate {
        return {
            ...this.getLinkCreate(),
            url: '',
        };
    }

    getArgumentErrorEmptyLinkName(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_LINK.WRONG_NAME_ARGUMENT);
    }

    getArgumentErrorEmptyLinkUrl(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_LINK.WRONG_URL_ARGUMENT);
    }

    getArgumentErrorWrongId(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_LINK.WRONG_ID_ARGUMENT);
    }

    getUserId(): number {
        return 1;
    }
}
