import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { GroupTagEntity } from '../entity/group-tag.entity';

const GROUP_TAG_ENTITY_REPOSITORY_TOKEN = GroupTagEntity.name;

@Service()
export class GroupTagRepository {
    constructor(
        @Inject(GROUP_TAG_ENTITY_REPOSITORY_TOKEN)
        private readonly _groupTagRepository: Repository<GroupTagEntity>
    ) {}
}
