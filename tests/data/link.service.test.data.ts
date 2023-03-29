import { ERROR_MESSAGE_LINK } from '@constant/error-message/error-message-link.constant';
import { LinkEntity } from '@entity/link.entity';
import { ArgumentError } from '@error/argument.error';
import { ILinkCreate } from '@model/link/link-create.model';

export class LinkServiceTestData {
    getLinkCreate(): ILinkCreate {
        return {
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

    getLinkCreateWithEmptyName(): ILinkCreate {
        return {
            ...this.getLinkCreate(),
            name: '',
        };
    }

    getArgumentErrorEmptyLinkName(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_LINK.WRONG_NAME_ARGUMENT);
    }

    getLinkCreateWithEmptyUrl(): ILinkCreate {
        return {
            ...this.getLinkCreate(),
            url: '',
        };
    }

    getArgumentErrorEmptyLinkUrl(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_LINK.WRONG_URL_ARGUMENT);
    }

    getUserId(): number {
        return 1;
    }
}
