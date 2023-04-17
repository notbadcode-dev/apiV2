import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';

@Service()
export class LinkOrderRepository {
    constructor(
        @Inject(LinkOrderRepository.name)
        private readonly _linkOrderRepository: Repository<LinkOrderRepository>
    ) {}
}
