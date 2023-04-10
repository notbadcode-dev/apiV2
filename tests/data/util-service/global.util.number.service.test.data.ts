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
        const sameValue = 1;
        return {
            firstValue: sameValue,
            secondValue: sameValue,
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
        const sameValue = '1';
        return {
            firstValue: sameValue,
            secondValue: sameValue,
            result: true,
        };
    }
}
