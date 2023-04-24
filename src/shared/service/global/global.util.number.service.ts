import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { DataType, VALID_DATA_TYPE_TO_NUMBER_LIST } from '@constant/type.constant';
import { InternalServerError } from '@error/internal-server.error';
import { Service } from 'typedi';

type NumberString = number | string;

@Service()
export class GlobalUtilNumberService {
    public convertNumber(value: NumberString): number | void {
        const VALUE_TYPE: string = typeof value;

        if (!VALID_DATA_TYPE_TO_NUMBER_LIST.includes(VALUE_TYPE)) {
            throw new InternalServerError(ERROR_MESSAGE_UTIL.INVALID_NUMBER_CONVERSION);
        }

        const TRANSFORM_VALUE: string = value?.toString();

        if (VALUE_TYPE.includes(DataType.String) && !Number.isNaN(Number(TRANSFORM_VALUE))) {
            return parseFloat(TRANSFORM_VALUE);
        }

        const PARSED_VALUE: number = parseInt(TRANSFORM_VALUE, 10);

        if (isNaN(PARSED_VALUE)) {
            throw new InternalServerError(ERROR_MESSAGE_UTIL.PARSED_VALUE_IS_NAN(value.toString()));
        }

        return PARSED_VALUE;
    }

    public areNumericValuesEqual(firstValue: NumberString, secondValue: NumberString): boolean {
        if (typeof firstValue !== typeof secondValue) {
            throw new InternalServerError(ERROR_MESSAGE_UTIL.VALUES_NOT_SAME_TYPE);
        }

        const PARSED_FIRST_VALUE = this.convertNumber(firstValue);
        const PARSED_SECOND_VALUE = this.convertNumber(secondValue);

        const ARE_NUMERIC_EQUAL: boolean = PARSED_FIRST_VALUE === PARSED_SECOND_VALUE;
        return ARE_NUMERIC_EQUAL;
    }
}
