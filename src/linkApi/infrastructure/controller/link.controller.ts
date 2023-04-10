import { ILinkCreate } from '@model/link/link-create.model';
import { ILink } from '@model/link/link.model';
import { Authority } from '@service/decorator/authority.decorator';
import { Request } from 'express';
import { Body, JsonController, Param, Post, Req } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { LinkService } from '../service/link.service';

@Service()
@JsonController('/link')
export class UserController {
    constructor(@Inject() private linkService: LinkService) {}

    @Authority
    @Post('/')
    async createLink(@Req() req: Request, @Body() createLink: ILinkCreate): Promise<ILink> {
        return await this.linkService.createLink(createLink);
    }

    @Authority
    @Post('/:id')
    async updateLink(@Req() req: Request, @Param('id') linkId: number, @Body() updateLink: ILink): Promise<ILink> {
        return await this.linkService.updateLink(updateLink);
    }
}
