import { ILinkCreate } from '@model/link/link-create.model';
import { ILink } from '@model/link/link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';

export interface ILinkService {
    createLink(linkCreate: ILinkCreate): Promise<ILink>;

    updateLink(linkId: number, link: ILink): Promise<ILink>;

    getLink(linkId: number): Promise<ILink>;

    getLinkList(): Promise<ILink[]>;

    getPaginateLinkList(paginateLinkList: IPaginateItem<ILink>): Promise<IPaginateItem<ILink>>;

    changeActiveLink(linkId: number, active: boolean): Promise<ILink>;

    changeFavoriteLink(linkId: number, favorite: boolean): Promise<ILink>;

    deleteLink(deleteLinkId: number): Promise<boolean>;
}
