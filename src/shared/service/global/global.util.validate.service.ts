import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { InternalServerError } from '@error/internal-server.error';
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
}
