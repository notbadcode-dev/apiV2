import dayjs from 'dayjs';
import { Service, Token } from 'typedi';
import { IGlobalUtilDateService } from './global.util.date.service.interface';

export const GLOBAL_UTIL_STRING_SERVICE = new Token<IGlobalUtilDateService>('GlobalUtilDateService');

@Service()
export class GlobalUtilDateService implements IGlobalUtilDateService {
    public formatDate(format: string, date: Date | string): string {
        if (!format?.length) {
            return '';
        }

        return dayjs(date).format(format);
    }
}
