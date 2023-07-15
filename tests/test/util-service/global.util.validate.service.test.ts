import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { InternalServerError } from '@error/internal-server.error';
import { GlobalUtilNumberService } from '@service/global/global.util.number.service';
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service';
import { anyNumber, instance, mock, when } from 'ts-mockito';

let globalUtilValidateService: GlobalUtilValidateService;
let globalUtilNumberServiceMock: GlobalUtilNumberService;

beforeEach(() => {
    globalUtilNumberServiceMock = mock(GlobalUtilNumberService);
    globalUtilValidateService = new GlobalUtilValidateService(instance(globalUtilNumberServiceMock));
});

describe('controlSameIdOnParamAndBody', () => {
    it('Should throw an InternalServerError when non match same id', () => {
        // Arrange
        when(globalUtilNumberServiceMock.areNumericValuesEqual(0, 1)).thenReturn(false);

        // Act & Assert
        expect(() => {
            globalUtilValidateService.controlSameIdOnParamAndBody(0, 1);
        }).toThrowError(new InternalServerError(ERROR_MESSAGE_UTIL.NOT_MATCH_PARAM_ID_BODY_ID));
    });

    it('should not throw an error and not return anything when paramId and bodyId are equal', () => {
        // Arrange
        when(globalUtilNumberServiceMock.areNumericValuesEqual(anyNumber(), anyNumber())).thenReturn(true);

        // Act & Assert
        expect(() => {
            globalUtilValidateService.controlSameIdOnParamAndBody(1, 1);
        }).not.toThrow();
    });
});
