import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { InternalServerError } from '@error/internal-server.error';
import { GlobalUtilNumberService } from '@service/global/global.util.number.service/global.util.number.service';
import { GlobalUtilNumberServiceTestData } from '@testData/util-service/global.util.number.service.test.data';
import { IAreNumericValuesEqual } from 'tests/model/global.util.number.service.test.model';

//#region Attributes

let globalUtilNumberService: GlobalUtilNumberService;

//#endregion

//#region Constructor

beforeEach(() => {
    globalUtilNumberService = new GlobalUtilNumberService();
});

//#endregion

//#region Test data

const GLOBAL_UTIL_NUMBER_SERVICE_TEST_DATA: GlobalUtilNumberServiceTestData = new GlobalUtilNumberServiceTestData();

//#endregion

describe('convertNumber', () => {
    it('Should return a number when passed a number value', () => {
        // Arrange
        const VALUE = 1;

        // Act
        const RESULT = globalUtilNumberService.convertNumber(VALUE);

        //Assert
        expect(RESULT).toBe(VALUE);
    });

    it('Should return a number when passed a string value representing a number', () => {
        // Arrange
        const VALUE = '1';

        // Act
        const RESULT = globalUtilNumberService.convertNumber(VALUE);

        //Assert
        expect(RESULT).toBe(parseInt(VALUE, 10));
    });

    it('Should throw an InternalServerError when passed a non-valid string value', () => {
        // Arrange
        const VALUE = 'test';

        // Act & Assert
        expect(() => {
            globalUtilNumberService.convertNumber(VALUE);
        }).toThrowError(new InternalServerError(ERROR_MESSAGE_UTIL.PARSED_VALUE_IS_NAN(VALUE)));
    });
});

describe('areNumericValuesEqual', () => {
    it('Should throw an InternalServerError when passed numeric values of different types', () => {
        // Arrange
        const VALUES: IAreNumericValuesEqual<number, string> =
            GLOBAL_UTIL_NUMBER_SERVICE_TEST_DATA.getValuesForAreNumericValuesEqualNumberAndStringReturnThrowInternalServerError();

        // Act & Assert
        expect(() => {
            globalUtilNumberService.areNumericValuesEqual(VALUES.firstValue, VALUES.secondValue);
        }).toThrowError(new InternalServerError(ERROR_MESSAGE_UTIL.VALUES_NOT_SAME_TYPE));
    });

    it('Should return false when passed two numeric values that do not match', () => {
        // Arrange
        const VALUES: IAreNumericValuesEqual<number, number> =
            GLOBAL_UTIL_NUMBER_SERVICE_TEST_DATA.getValuesForAreNumericValuesEqualAllNumbersReturnFalse();

        // Act
        const RESULT: boolean = globalUtilNumberService.areNumericValuesEqual(VALUES.firstValue, VALUES.secondValue);

        // Assert
        expect(RESULT).toEqual(VALUES.result);
    });

    it('Should return true when passed two numeric values that match', () => {
        // Arrange
        const VALUES: IAreNumericValuesEqual<number, number> =
            GLOBAL_UTIL_NUMBER_SERVICE_TEST_DATA.getValuesForAreNumericValuesEqualAllNumbersReturnTrue();

        // Act
        const RESULT: boolean = globalUtilNumberService.areNumericValuesEqual(VALUES.firstValue, VALUES.secondValue);

        // Assert
        expect(RESULT).toEqual(VALUES.result);
    });

    it('Should return false when passed two string values that do not match', () => {
        // Arrange
        const VALUES: IAreNumericValuesEqual<string, string> =
            GLOBAL_UTIL_NUMBER_SERVICE_TEST_DATA.getValuesForAreNumericValuesEqualAllStringsReturnFalse();

        // Act
        const RESULT: boolean = globalUtilNumberService.areNumericValuesEqual(VALUES.firstValue, VALUES.secondValue);

        // Assert
        expect(RESULT).toEqual(VALUES.result);
    });

    it('Should return true when passed two string values that match', () => {
        // Arrange
        const VALUES: IAreNumericValuesEqual<string, string> =
            GLOBAL_UTIL_NUMBER_SERVICE_TEST_DATA.getValuesForAreNumericValuesEqualAllStringReturnTrue();

        // Act
        const RESULT: boolean = globalUtilNumberService.areNumericValuesEqual(VALUES.firstValue, VALUES.secondValue);

        // Assert
        expect(RESULT).toEqual(VALUES.result);
    });
});
