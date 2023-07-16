import { ITagService } from '@service/interface/tag.service.interface';
import { Service, Token } from 'typedi';

export const TAG_SERVICE_TOKEN = new Token<ITagService>('TagService');

@Service(TAG_SERVICE_TOKEN)
export class TagService implements ITagService {}