import { IDeleteGroup } from '@model/group/delete-group.model';
import { IGroup } from '@model/group/group.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { Authority } from '@service/decorator/authority.decorator';
import { GroupLinkService, GROUP_LINK_SERVICE_TOKEN } from '@service/group-link.service/group-link.service';
import { Request } from 'express';
import { Body, Delete, Get, JsonController, Param, Patch, Post, Req } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
@JsonController('/groupLink')
export class GroupLinkController {
    constructor(@Inject(GROUP_LINK_SERVICE_TOKEN) private _groupLinkService: GroupLinkService) {}

    @Authority
    @Post('/')
    async createGroupLink(@Req() req: Request, @Body() createGroupLink: IGroup): Promise<IGroup | null> {
        const RESULT: IGroup | null = await this._groupLinkService.createGroupLink(createGroupLink);
        return RESULT;
    }

    @Authority
    @Patch('/:id')
    async updateLink(@Req() req: Request, @Param('id') groupLinkId: number, @Body() updateLink: IGroup): Promise<IGroup | null> {
        const RESULT: IGroup | null = await this._groupLinkService.updateGroupLink(groupLinkId, updateLink);
        return RESULT;
    }

    @Authority
    @Get('/:id')
    async getGroupLink(@Req() req: Request, @Param('id') groupLinkId: number): Promise<IGroup | null> {
        const RESULT: IGroup | null = await this._groupLinkService.getGroupLink(groupLinkId);
        return RESULT;
    }

    @Authority
    @Get('/')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    async getLinkList(@Req() req: Request): Promise<(IGroup | null)[]> {
        const RESULT: (IGroup | null)[] = await this._groupLinkService.getGroupLinkList();
        return RESULT;
    }

    @Authority
    @Post('/paginate/')
    async getPaginateLinkList(@Req() req: Request, @Body() paginateLinkList: IPaginateItem<IGroup>): Promise<IPaginateItem<IGroup | null>> {
        const RESULT: IPaginateItem<IGroup | null> = await this._groupLinkService.getPaginateGroupLinkList(paginateLinkList);
        return RESULT;
    }

    @Authority
    @Delete('/delete/')
    async deleteLink(@Req() req: Request, @Body() deleteGroupLink: IDeleteGroup): Promise<boolean> {
        const RESULT: boolean = await this._groupLinkService.deleteGroupLink(deleteGroupLink);
        return RESULT;
    }
}
