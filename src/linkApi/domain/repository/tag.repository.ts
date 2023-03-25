import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { TagEntity } from '../entity/tag.entity';

@Service()
export class TagRepository {
    constructor(
        @Inject(TagEntity.name)
        private readonly tagRepository: Repository<TagEntity>
    ) {}
}
