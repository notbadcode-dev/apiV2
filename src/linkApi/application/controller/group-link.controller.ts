import { ILinkGroup } from '@model/group/group-link.model';
import { GROUP_LINK_SERVICE_TOKEN } from '@service/group-link.service/group-link.service';
import { IGroupLinkService } from '@service/group-link.service/group-link.service.interface';
import { Request } from 'express';
import { Get, JsonController, Param, Req } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
@JsonController('/groupLink')
export class GroupLinkController {
    constructor(@Inject(GROUP_LINK_SERVICE_TOKEN) private _groupLinkService: IGroupLinkService) {}

    @Get('/:id')
    async getGroupLink(@Req() req: Request, @Param('id') groupLinkId: number): Promise<ILinkGroup | null> {
        const RESULT: ILinkGroup | null = await this._groupLinkService.getGroupLink(groupLinkId);
        return RESULT;
    }
}
