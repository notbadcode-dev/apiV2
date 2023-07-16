import { IGroupLinkService } from '@service/interface/group-link.service.interface';
import { JsonController } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { GROUP_LINK_SERVICE_TOKEN } from '../service/group-link.service';

@Service()
@JsonController('/group-link')
export class UserController {
    constructor(@Inject(GROUP_LINK_SERVICE_TOKEN) private _groupLinkService: IGroupLinkService) {}
}
