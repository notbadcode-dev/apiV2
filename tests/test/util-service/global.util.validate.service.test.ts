import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { InternalServerError } from '@error/internal-server.error';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { GlobalUtilNumberService } from '@service/global/global.util.number.service/global.util.number.service';
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service/global.util.validate.service';
import { PaginateTestData } from '@testData/service/paginate.test.data';
import { anyNumber, instance, mock, when } from 'ts-mockito';

//#region Attributes

let globalUtilValidateService: GlobalUtilValidateService;
let globalUtilNumberServiceMock: GlobalUtilNumberService;

//#endregion

//#region Constructor

beforeEach(() => {
    globalUtilNumberServiceMock = mock(GlobalUtilNumberService);
    globalUtilValidateService = new GlobalUtilValidateService(instance(globalUtilNumberServiceMock));
});

//#endregion

//#region Test data

const PAGINATE_TEST_DATA: PaginateTestData = new PaginateTestData();

//#endregion

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

describe('validatePaginate', () => {
    it('Should throw an ArgumentError when paginate take is Null', async () => {
        // Arrange
        const PAGINATE_ITEM_LINK: IPaginateItem<number> = PAGINATE_TEST_DATA.getPaginateWithTakeIsNull();

        // Act & Assert
        expect(() => {
            globalUtilValidateService.validatePaginate(PAGINATE_ITEM_LINK);
        }).toThrowError(PAGINATE_TEST_DATA.getArgumentErrorInvalidPaginate());
    });

    it('Should throw an ArgumentError when paginate take is NaN', async () => {
        // Arrange
        const PAGINATE_ITEM_LINK: IPaginateItem<number> = PAGINATE_TEST_DATA.getPaginateWithTakeIsNaN();

        // Act & Assert
        expect(() => {
            globalUtilValidateService.validatePaginate(PAGINATE_ITEM_LINK);
        }).toThrowError(PAGINATE_TEST_DATA.getArgumentErrorInvalidPaginate());
    });

    it('Should throw an ArgumentError when paginate take is Zero', async () => {
        // Arrange
        const PAGINATE_ITEM_LINK: IPaginateItem<number> = PAGINATE_TEST_DATA.getPaginateWithTakeIsZero();

        // Act & Assert
        expect(() => {
            globalUtilValidateService.validatePaginate(PAGINATE_ITEM_LINK);
        }).toThrowError(PAGINATE_TEST_DATA.getArgumentErrorInvalidPaginate());
    });
});
