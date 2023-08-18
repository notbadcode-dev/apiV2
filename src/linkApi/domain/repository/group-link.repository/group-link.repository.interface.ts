import { GroupLinkEntity } from '@entity/group_link.entity';

export interface IGroupLinkRepository {
    create(link: GroupLinkEntity): Promise<GroupLinkEntity>;

    getById(groupLinkId: number): Promise<GroupLinkEntity>;
}
