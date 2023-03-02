import { FORMAT_DATE } from 'shared/constant/format/format-date.constant';
import { Inject, Service } from 'typedi';

import { GlobalUtilDateService } from './global.util.date.service';

@Service()
export class GlobalUtilStringService {
    constructor(@Inject() private _globalUtilDateService: GlobalUtilDateService) {}

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
