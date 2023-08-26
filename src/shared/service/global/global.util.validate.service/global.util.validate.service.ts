import { ERROR_MESSAGE_PAGINATION } from '@constant/error-message/error-message-paginate.constant';
import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { ArgumentError } from '@error/argument.error';
import { InternalServerError } from '@error/internal-server.error';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { GlobalUtilNumberService, GLOBAL_UTIL_NUMBER_SERVICE } from '@service/global/global.util.number.service/global.util.number.service';
import { IGlobalUtilValidateService } from '@service/global/global.util.validate.service/global.util.validate.service.interface';
import 'reflect-metadata';
import { Inject, Service, Token } from 'typedi';

export const GLOBAL_UTIL_VALIDATE_SERVICE = new Token<IGlobalUtilValidateService>('GlobalUtilValidateService');

@Service(GLOBAL_UTIL_VALIDATE_SERVICE)
export class GlobalUtilValidateService implements IGlobalUtilValidateService {
    //#region Constructor

    constructor(@Inject(GLOBAL_UTIL_NUMBER_SERVICE) private _globalUtilNumberService: GlobalUtilNumberService) {}

    //#endregion

    //#region Public methods

    @LoggerMethodDecorator
    public controlSameIdOnParamAndBody(paramId: number, bodyId: number): void {
        const SAME_ID: boolean = this._globalUtilNumberService.areNumericValuesEqual(paramId, bodyId);

        if (!SAME_ID) {
            throw new InternalServerError(ERROR_MESSAGE_UTIL.NOT_MATCH_PARAM_ID_BODY_ID);
        }
    }

    @LoggerMethodDecorator
    public validatePaginate<T>(paginateList: IPaginateItem<T>): void {
        const VALIDATE_TAKE = paginateList?.take !== null && !isNaN(Number(paginateList?.take)) && paginateList?.take > 0;
        const VALIDATE_CURRENT_PAGE =
            paginateList.currentPage !== null || !isNaN(Number(paginateList?.currentPage)) || paginateList.currentPage > 0;

        let validateSkip = VALIDATE_TAKE && VALIDATE_CURRENT_PAGE;
        if (paginateList.skip) {
            validateSkip = paginateList?.skip !== null || !isNaN(Number(paginateList?.skip)) || paginateList?.skip > 0;
        }

        if (!VALIDATE_TAKE || !VALIDATE_CURRENT_PAGE || !validateSkip) {
            throw new ArgumentError(ERROR_MESSAGE_PAGINATION.MALFORMED_PAGINATION);
        }
    }

    //#endregion
}
