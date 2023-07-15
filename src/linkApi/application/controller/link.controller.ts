import { ILinkCreate } from '@model/link/link-create.model';
import { ILink } from '@model/link/link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { Authority } from '@service/decorator/authority.decorator';
import { Request } from 'express';
import { Body, Delete, Get, JsonController, Param, Patch, Post, Req } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { LinkService } from '../service/link.service';

@Service()
@JsonController('/link')
export class UserController {
    constructor(@Inject() private linkService: LinkService) {}

    @Authority
    @Post('/')
    async createLink(@Req() req: Request, @Body() createLink: ILinkCreate): Promise<ILink> {
        const RESULT: ILink = await this.linkService.createLink(createLink);
        return RESULT;
    }

    @Authority
    @Patch('/:id')
    async updateLink(@Req() req: Request, @Param('id') linkId: number, @Body() updateLink: ILink): Promise<ILink> {
        const RESULT: ILink = await this.linkService.updateLink(linkId, updateLink);
        return RESULT;
    }

    @Authority
    @Get('/:id')
    async getLink(@Req() req: Request, @Param('id') linkId: number): Promise<ILink> {
        const RESULT: ILink = await this.linkService.getLink(linkId);
        return RESULT;
    }

    @Authority
    @Get('/')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    async getLinkList(@Req() req: Request): Promise<ILink[]> {
        const RESULT: ILink[] = await this.linkService.getLinkList();
        return RESULT;
    }

    @Authority
    @Post('/paginate/')
    async getPaginateLinkList(@Req() req: Request, @Body() paginateLinkList: IPaginateItem<ILink>): Promise<IPaginateItem<ILink>> {
        const RESULT: IPaginateItem<ILink> = await this.linkService.getPaginateLinkList(paginateLinkList);
        return RESULT;
    }

    @Authority
    @Patch('/activate/:id')
    async markActive(@Req() req: Request, @Param('id') linkId: number): Promise<ILink> {
        const RESULT: ILink = await this.linkService.changeActiveLink(linkId, true);
        return RESULT;
    }

    @Authority
    @Patch('/deactivate/:id')
    async markInactive(@Req() req: Request, @Param('id') linkId: number): Promise<ILink> {
        const RESULT: ILink = await this.linkService.changeActiveLink(linkId, false);
        return RESULT;
    }

    @Authority
    @Patch('/favorite/:id')
    async markFavorite(@Req() req: Request, @Param('id') linkId: number): Promise<ILink> {
        const RESULT: ILink = await this.linkService.changeFavoriteLink(linkId, true);
        return RESULT;
    }

    @Authority
    @Patch('/unfavorite/:id')
    async markUnfavorite(@Req() req: Request, @Param('id') linkId: number): Promise<ILink> {
        const RESULT: ILink = await this.linkService.changeFavoriteLink(linkId, false);
        return RESULT;
    }

    @Authority
    @Delete('/:id')
    async deleteLink(@Req() req: Request, @Param('id') linkId: number): Promise<boolean> {
        const RESULT: boolean = await this.linkService.deleteLink(linkId);
        return RESULT;
    }
}
