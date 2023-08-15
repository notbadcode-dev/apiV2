import { UserLinkRelationEntity } from '@entity/user-link-relationship.entity';

export interface IUserLinkRelationRepository {
    getById(linkId: number): Promise<UserLinkRelationEntity>;
}
