import { ILinkCreate } from '@model/link/link-create.model';
import { ILink } from '@model/link/link.model';
import { Authority } from '@service/decorator/authority.decorator';
import { Body, JsonController, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { LinkService } from '../service/link.service';

@Service()
@JsonController('/link')
export class UserController {
    constructor(@Inject() private linkService: LinkService) {}

    @Authority
    @Post('/')
    async createLink(@Body() createLink: ILinkCreate): Promise<ILink> {
        return await this.linkService.createLink(createLink);
    }
}
