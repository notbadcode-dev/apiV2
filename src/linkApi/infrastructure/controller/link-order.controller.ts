import { JsonController } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@JsonController('/link-order')
export class UserController {}
