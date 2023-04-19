import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { InternalServerError } from '@error/internal-server.error';
import { GlobalUtilNumberService } from '@service/global/global.util.number.service';
import { GlobalUtilNumberServiceTestData } from '@testData/util-service/global.util.number.service.test.data';
import { IAreNumericValuesEqual } from 'tests/model/global.util.number.service.test.model';

describe('GlobalUtilNumberServiceTest', () => {
    const globalUtilNumberServiceTestData: GlobalUtilNumberServiceTestData = new GlobalUtilNumberServiceTestData();
    let globalUtilNumberServiceMock: GlobalUtilNumberService;

    beforeEach(() => {
        globalUtilNumberServiceMock = new GlobalUtilNumberService();
    });

    describe('convertNumber', () => {
        it('Should return a number when passed a number value', () => {
            // Arrange
            const value = 1;

            // Act
            const result = globalUtilNumberServiceMock.convertNumber(value);

            //Assert
            expect(result).toBe(value);
        });

        it('Should return a number when passed a string value representing a number', () => {
            // Arrange
            const value = '1';

            // Act
            const result = globalUtilNumberServiceMock.convertNumber(value);

            //Assert
            expect(result).toBe(parseInt(value, 10));
        });

        it('Should throw an InternalServerError when passed a non-valid string value', () => {
            // Arrange
            const value = 'test';

            // Act & Assert
            expect(() => {
                globalUtilNumberServiceMock.convertNumber(value);
            }).toThrowError(new InternalServerError(ERROR_MESSAGE_UTIL.PARSED_VALUE_IS_NAN(value)));
        });
    });

    describe('areNumericValuesEqual', () => {
        it('Should throw an InternalServerError when passed numeric values of different types', () => {
            // Arrange
            const values: IAreNumericValuesEqual<number, string> =
                globalUtilNumberServiceTestData.getValuesForAreNumericValuesEqualNumberAndStringReturnThrowInternalServerError();

            // Act & Assert
            expect(() => {
                globalUtilNumberServiceMock.areNumericValuesEqual(values.firstValue, values.secondValue);
            }).toThrowError(new InternalServerError(ERROR_MESSAGE_UTIL.VALUES_NOT_SAME_TYPE));
        });

        it('Should return false when passed two numeric values that do not match', () => {
            // Arrange
            const values: IAreNumericValuesEqual<number, number> =
                globalUtilNumberServiceTestData.getValuesForAreNumericValuesEqualAllNumbersReturnFalse();

            // Act
            const result: boolean = globalUtilNumberServiceMock.areNumericValuesEqual(values.firstValue, values.secondValue);

            // Assert
            expect(result).toEqual(values.result);
        });

        it('Should return true when passed two numeric values that match', () => {
            // Arrange
            const values: IAreNumericValuesEqual<number, number> =
                globalUtilNumberServiceTestData.getValuesForAreNumericValuesEqualAllNumbersReturnTrue();

            // Act
            const result: boolean = globalUtilNumberServiceMock.areNumericValuesEqual(values.firstValue, values.secondValue);

            // Assert
            expect(result).toEqual(values.result);
        });

        it('Should return false when passed two string values that do not match', () => {
            // Arrange
            const values: IAreNumericValuesEqual<string, string> =
                globalUtilNumberServiceTestData.getValuesForAreNumericValuesEqualAllStringsReturnFalse();

            // Act
            const result: boolean = globalUtilNumberServiceMock.areNumericValuesEqual(values.firstValue, values.secondValue);

            // Assert
            expect(result).toEqual(values.result);
        });

        it('Should return true when passed two string values that match', () => {
            // Arrange
            const values: IAreNumericValuesEqual<string, string> =
                globalUtilNumberServiceTestData.getValuesForAreNumericValuesEqualAllStringReturnTrue();

            // Act
            const result: boolean = globalUtilNumberServiceMock.areNumericValuesEqual(values.firstValue, values.secondValue);

            // Assert
            expect(result).toEqual(values.result);
        });
    });
});
