import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { GroupTagEntity } from '../entity/group-tag.entity';

@Service()
export class GroupTagRepository {
    constructor(
        @Inject(GroupTagEntity.name)
        private readonly groupTagRepository: Repository<GroupTagEntity>
    ) {}
}
