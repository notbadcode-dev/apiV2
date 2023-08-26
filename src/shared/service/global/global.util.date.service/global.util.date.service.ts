import { IGlobalUtilDateService } from '@service/global/global.util.date.service/global.util.date.service.interface';
import dayjs from 'dayjs';
import { Service, Token } from 'typedi';

export const GLOBAL_UTIL_DATE_SERVICE = new Token<IGlobalUtilDateService>('GlobalUtilDateService');

@Service(GLOBAL_UTIL_DATE_SERVICE)
export class GlobalUtilDateService implements IGlobalUtilDateService {
    public formatDate(format: string, date: Date | string): string {
        if (!format?.length) {
            return '';
        }

        return dayjs(date).format(format);
    }
}
