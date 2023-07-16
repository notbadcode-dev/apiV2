import { JsonController } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { TagService, TAG_SERVICE_TOKEN } from '../service/tag.service/tag.service';

@Service()
@JsonController('/tag')
export class UserController {
    constructor(@Inject(TAG_SERVICE_TOKEN) private tagService: TagService) {}
}
