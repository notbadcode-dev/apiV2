import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { LinkTagEntity } from '../entity/link-tag.entity';

@Service()
export class LinkTagRepository {
    constructor(
        @Inject(LinkTagEntity.name)
        private readonly linkTagRepository: Repository<LinkTagEntity>
    ) {}
}
