import { ILinkGroup } from '@model/group/group-link.model';
import { IGroup } from '@model/group/group.model';
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
    async getGroupLink(@Req() req: Request, @Param('id') groupLinkId: number): Promise<ILinkGroup | null> {
        const RESULT: ILinkGroup | null = await this._groupLinkService.getGroupLink(groupLinkId);
        return RESULT;
    }
}
