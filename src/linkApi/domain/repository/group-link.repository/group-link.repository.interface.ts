import { LinkGroupEntity } from '@entity/link-group.entity';

export interface IGroupLinkRepository {
    create(link: LinkGroupEntity): Promise<LinkGroupEntity>;

    getById(groupLinkId: number): Promise<LinkGroupEntity>;
}
