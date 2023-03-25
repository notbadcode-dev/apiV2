import { JsonController } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { TagService } from '../service/tag.service';

@Service()
@JsonController('/tag')
export class UserController {
    constructor(@Inject() private tagService: TagService) {}
}
