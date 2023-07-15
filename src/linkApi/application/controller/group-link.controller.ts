import { JsonController } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { GroupLinkService } from '../service/group-link.service';

@Service()
@JsonController('/group-link')
export class UserController {
    constructor(@Inject() private groupLinkService: GroupLinkService) {}
}
