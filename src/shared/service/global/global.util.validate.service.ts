import { ERROR_MESSAGE_PAGINATION } from '@constant/error-message/error-message-paginate.constant';
import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { ArgumentError } from '@error/argument.error';
import { InternalServerError } from '@error/internal-server.error';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { GlobalUtilNumberService } from '@service/global/global.util.number.service';
import 'reflect-metadata';
import { Inject, Service } from 'typedi';

@Service()
export class GlobalUtilValidateService {
    constructor(@Inject() private _globalUtilNumberService: GlobalUtilNumberService) {}

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
}
