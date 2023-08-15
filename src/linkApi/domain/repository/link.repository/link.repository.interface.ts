import { LinkEntity } from '@entity/link.entity';
import { ILink } from '@model/link/link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';

export interface ILinkRepository {
    create(link: LinkEntity): Promise<LinkEntity>;

    createList(linkList: LinkEntity[]): Promise<LinkEntity[]>;

    update(link: ILink): Promise<LinkEntity>;

    getById(linkId: number): Promise<LinkEntity>;

    getAll(): Promise<LinkEntity[]>;

    getAllPaginated(paginateItem: IPaginateItem<ILink>): Promise<IPaginateItem<LinkEntity>>;

    delete(linkId: number): Promise<boolean>;
}
