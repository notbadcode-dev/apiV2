import { ILinkCreate } from 'linkApi/domain/model/link/link-create.model';
import { ILink } from 'linkApi/domain/model/link/link.model';
import { Body, JsonController, Post } from 'routing-controllers';
import { Authority } from 'shared/service/decorator/authority.decorator';
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
