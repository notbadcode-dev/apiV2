import { ERROR_MESSAGE_USER } from '@constant/error-message/error-message-user.constant';
import { UserLinkRelationEntity } from '@entity/user-link-relationship.entity';
import { NotFountError } from '@error/not-found.error';
import { IUserLinkRelationRepository } from '@repository/user-link-relation.repository/user-link-relation.repository.interface';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { Inject, Service, Token } from 'typedi';
import { Repository } from 'typeorm';

export const USER_LINK_RELATION_REPOSITORY = new Token<IUserLinkRelationRepository>('UserLinkRelationRepository');
const USER_LINK_RELATION_ENTITY_TOKEN = UserLinkRelationEntity.name;

@Service(USER_LINK_RELATION_REPOSITORY)
export class UserLinkRelationRepository implements IUserLinkRelationRepository {
    constructor(
        @Inject(USER_LINK_RELATION_ENTITY_TOKEN)
        private readonly _userLinkRelationRepository: Repository<UserLinkRelationEntity>
    ) {}

    @LoggerMethodDecorator
    public async getById(linkGroupRelationId: number): Promise<UserLinkRelationEntity> {
        const USER_LINK_RELATION_ENTITY: UserLinkRelationEntity | null = await this._userLinkRelationRepository.findOne({
            where: { user: { id: linkGroupRelationId } },
        });

        if (!USER_LINK_RELATION_ENTITY || !USER_LINK_RELATION_ENTITY.id) {
            throw new NotFountError(ERROR_MESSAGE_USER.USER_WITH_ID_NOT_FOUND(linkGroupRelationId));
        }

        return USER_LINK_RELATION_ENTITY;
    }
}
