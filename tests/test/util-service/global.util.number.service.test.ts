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
        it('NumberValue_ShouldReturnNumber', () => {
            // Arrange
            const value = 1;

            // Act
            const result = globalUtilNumberServiceMock.convertNumber(value);

            //Assert
            expect(result).toBe(value);
        });

        it('StringValue_ShouldReturnNumber', () => {
            // Arrange
            const value = '1';

            // Act
            const result = globalUtilNumberServiceMock.convertNumber(value);

            //Assert
            expect(result).toBe(parseInt(value, 10));
        });

        it('StringNonValidValue_ShouldReturnNumber', () => {
            // Arrange
            const value = 'test';

            // Act & Assert
            expect(() => {
                globalUtilNumberServiceMock.convertNumber(value);
            }).toThrowError(new InternalServerError(ERROR_MESSAGE_UTIL.PARSED_VALUE_IS_NAN(value)));
        });
    });

    describe('areNumericValuesEqual', () => {
        it('NumberAndStringValues_ShouldThrowInternalServerError', () => {
            // Arrange
            const values: IAreNumericValuesEqual<number, string> =
                globalUtilNumberServiceTestData.getValuesForAreNumericValuesEqualNumberAndStringReturnThrowInternalServerError();

            // Act & Assert
            expect(() => {
                globalUtilNumberServiceMock.areNumericValuesEqual(values.firstValue, values.secondValue);
            }).toThrowError(new InternalServerError(ERROR_MESSAGE_UTIL.VALUES_NOT_SAME_TYPE));
        });

        it('NumberValuesNotMatch_ShoulRetirn', () => {
            // Arrange
            const values: IAreNumericValuesEqual<number, number> =
                globalUtilNumberServiceTestData.getValuesForAreNumericValuesEqualAllNumbersReturnFalse();

            // Act
            const result: boolean = globalUtilNumberServiceMock.areNumericValuesEqual(values.firstValue, values.secondValue);

            // Assert
            expect(result).toEqual(values.result);
        });

        it('NumberValuesMatch_ShouldReturnFalse', () => {
            // Arrange
            const values: IAreNumericValuesEqual<number, number> =
                globalUtilNumberServiceTestData.getValuesForAreNumericValuesEqualAllNumbersReturnTrue();

            // Act
            const result: boolean = globalUtilNumberServiceMock.areNumericValuesEqual(values.firstValue, values.secondValue);

            // Assert
            expect(result).toEqual(values.result);
        });

        it('StringValuesNotMatch_ShouldReturnFalse', () => {
            // Arrange
            const values: IAreNumericValuesEqual<string, string> =
                globalUtilNumberServiceTestData.getValuesForAreNumericValuesEqualAllStringsReturnFalse();

            // Act
            const result: boolean = globalUtilNumberServiceMock.areNumericValuesEqual(values.firstValue, values.secondValue);

            // Assert
            expect(result).toEqual(values.result);
        });

        it('StringValuesMatch_ShouldReturnFalse', () => {
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
