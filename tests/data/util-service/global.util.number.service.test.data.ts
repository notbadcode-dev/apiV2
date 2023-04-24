import { IAreNumericValuesEqual } from 'tests/model/global.util.number.service.test.model';

export class GlobalUtilNumberServiceTestData {
    getValuesForAreNumericValuesEqualNumberAndStringReturnThrowInternalServerError(): IAreNumericValuesEqual<number, string> {
        return {
            firstValue: 1,
            secondValue: '1',
        };
    }

    getValuesForAreNumericValuesEqualAllNumbersReturnFalse(): IAreNumericValuesEqual<number, number> {
        return {
            firstValue: 1,
            secondValue: 2,
            result: false,
        };
    }

    getValuesForAreNumericValuesEqualAllNumbersReturnTrue(): IAreNumericValuesEqual<number, number> {
        const SAME_VALUE = 1;
        return {
            firstValue: SAME_VALUE,
            secondValue: SAME_VALUE,
            result: true,
        };
    }

    getValuesForAreNumericValuesEqualAllStringsReturnFalse(): IAreNumericValuesEqual<string, string> {
        return {
            firstValue: '1',
            secondValue: '2',
            result: false,
        };
    }

    getValuesForAreNumericValuesEqualAllStringReturnTrue(): IAreNumericValuesEqual<string, string> {
        const SAME_VALUE = '1';
        return {
            firstValue: SAME_VALUE,
            secondValue: SAME_VALUE,
            result: true,
        };
    }
}
