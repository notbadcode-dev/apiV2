import { loggerMethod } from 'shared/service/decorator/logger-method.decorator';
import { Service } from 'typedi';

@Service()
export class AuthService {
    @loggerMethod
    public async signUp(): Promise<boolean> {
        return await new Promise(() => {
            return true;
        });
    }
}
