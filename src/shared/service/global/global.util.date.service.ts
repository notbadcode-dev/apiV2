import dayjs from 'dayjs';
import { Service } from 'typedi';

@Service()
export class GlobalUtilDateService {
    public formatDate(format: string, date: Date | string): string {
        if (!format?.length) {
            return '';
        }

        return dayjs(date).format(format);
    }
}
