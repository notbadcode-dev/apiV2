import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { DATA_TYPE, VALID_DATA_TYPE_TO_NUMBER_LIST } from '@constant/type.constant';
import { InternalServerError } from '@error/internal-server.error';
import { Service } from 'typedi';

type NumberString = number | string;

@Service()
export class GlobalUtilNumberService {
    public convertNumber(value: NumberString): number | void {
        const valueType: string = typeof value;

        if (!VALID_DATA_TYPE_TO_NUMBER_LIST.includes(valueType)) {
            throw new InternalServerError(ERROR_MESSAGE_UTIL.INVALID_NUMBER_CONVERSION);
        }

        const transformValue: string = value?.toString();

        if (valueType.includes(DATA_TYPE.String) && !Number.isNaN(Number(transformValue))) {
            return parseFloat(transformValue);
        }

        const parsedValue: number = parseInt(transformValue, 10);

        if (isNaN(parsedValue)) {
            throw new InternalServerError(ERROR_MESSAGE_UTIL.PARSED_VALUE_IS_NAN(value.toString()));
        }

        return parsedValue;
    }

    public areNumericValuesEqual(firstValue: NumberString, secondValue: NumberString): boolean {
        if (typeof firstValue !== typeof secondValue) {
            throw new InternalServerError(ERROR_MESSAGE_UTIL.VALUES_NOT_SAME_TYPE);
        }

        const parsedFirstValue = this.convertNumber(firstValue);
        const parsedSecondValue = this.convertNumber(secondValue);

        const areNumericEqual: boolean = parsedFirstValue === parsedSecondValue;
        return areNumericEqual;
    }
}
