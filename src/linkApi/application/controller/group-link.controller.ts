import { IGroup } from '@model/group/group.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { Authority } from '@service/decorator/authority.decorator';
import { GroupLinkService, GROUP_LINK_SERVICE_TOKEN } from '@service/group-link.service/group-link.service';
import { Request } from 'express';
import { Body, Get, JsonController, Param, Post, Req } from 'routing-controllers';
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
        const RESULT: IPaginateItem<IGroup | null> = await this._groupLinkService.getPaginateLinkList(paginateLinkList);
        return RESULT;
    }
}
