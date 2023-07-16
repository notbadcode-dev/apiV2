import { FORMAT_DATE } from '@constant/format/format-date.constant';
import { Inject, Service, Token } from 'typedi';

import { GlobalUtilDateService, GLOBAL_UTIL_DATE_SERVICE } from '../global.util.date.service/global.util.date.service';
import { IGlobalUtilStringService } from './global.util.string.service.interface';

export const GLOBAL_UTIL_STRING_SERVICE = new Token<IGlobalUtilStringService>('GlobalUtilStringService');

@Service(GLOBAL_UTIL_STRING_SERVICE)
export class GlobalUtilStringService implements IGlobalUtilStringService {
    constructor(@Inject(GLOBAL_UTIL_DATE_SERVICE) private _globalUtilDateService: GlobalUtilDateService) {}

    public formatValues(formattedData: string, parameterDataList: (string | number | Date)[]): string {
        return parameterDataList
            .map((value) => this.convertToString(value))
            .reduce((previousValue, value, index) => {
                return (formattedData = formattedData.replace(`{${index}}`, value));
            }, '');
    }

    private convertToString(data: number | string | Date): string {
        if (!data) {
            return '';
        }

        const IS_FROM_NUMBER: boolean = typeof data === 'number';
        if (IS_FROM_NUMBER) {
            const CONVERTED_FROM_NUMBER = Number(data).toString();
            return CONVERTED_FROM_NUMBER;
        }

        const IS_FROM_DATE: boolean = typeof data === 'object' && data instanceof Date && typeof data?.getMonth === 'function';
        if (IS_FROM_DATE) {
            const CONVERTED_FROM_DATE: string = this._globalUtilDateService.formatDate(FORMAT_DATE.SHORT_DATE_TIME, data.toString());
            return CONVERTED_FROM_DATE;
        }

        return data?.toString();
    }
}
