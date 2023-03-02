import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGE_PASSWORD } from 'shared/constant/error-message/error-message-password';
import { Service } from 'typedi';
import { loggerMethod } from './decorator/logger-method.decorator';

@Service()
export class PasswordService {
    private saltRounds = 10;

    @loggerMethod
    async hashPassword(password: string): Promise<string> {
        try {
            const hash = await bcrypt.hash(password, this.saltRounds);
            return hash;
        } catch (err) {
            throw new Error(ERROR_MESSAGE_PASSWORD.FAILED_TO_ENCRYPT_PASSWORD);
        }
    }

    @loggerMethod
    async verifyPassword(password: string, hash: string): Promise<boolean> {
        try {
            const result = await bcrypt.compare(password, hash);
            return result;
        } catch (err) {
            throw new Error(ERROR_MESSAGE_PASSWORD.FAILED_TO_VERIFY_PASSWORD);
        }
    }
}
