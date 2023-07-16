import { ERROR_MESSAGE_PASSWORD } from '@constant/error-message/error-message-password.constant';
import { LoggerMethodDecorator } from '@decorator/logger-method.decorator';
import { IPasswordService } from '@service/middleware/password.service/password.service.interface';
import * as bcrypt from 'bcrypt';
import { Service, Token } from 'typedi';

export const PASSWORD_SERVICE_TOKEN = new Token<IPasswordService>('PasswordService');

@Service(PASSWORD_SERVICE_TOKEN)
export class PasswordService implements IPasswordService {
    private saltRounds = 10;

    @LoggerMethodDecorator
    async hashPassword(password: string): Promise<string> {
        try {
            const HASH = await bcrypt.hash(password, this.saltRounds);
            return HASH;
        } catch (err) {
            throw new Error(ERROR_MESSAGE_PASSWORD.FAILED_TO_ENCRYPT_PASSWORD);
        }
    }

    @LoggerMethodDecorator
    async verifyPassword(password: string, hash: string): Promise<boolean> {
        try {
            const RESULT = await bcrypt.compare(password, hash);
            return RESULT;
        } catch (err) {
            throw new Error(ERROR_MESSAGE_PASSWORD.FAILED_TO_VERIFY_PASSWORD);
        }
    }
}
