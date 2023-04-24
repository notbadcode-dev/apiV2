import { HTTP_RESPONSE_MESSAGE, HTTP_RESPONSE_MESSAGE_TYPE, HTTP_RESPONSE_STATUS } from '@constant/http.constant';
import { IErrorMiddlewareError } from '@model/error-middleware/error-middleware-error.model';
import { IHttpResponse } from '@model/http-response/http-response.model';
import TranslationService from '@service/translate.service';
import { NextFunction, Request, Response } from 'express/index';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';

@Middleware({ type: 'after' })
@Service()
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    translationService: TranslationService = new TranslationService();

    error(error: IErrorMiddlewareError, request: Request, response: Response, next: NextFunction): void {
        if (response.headersSent) {
            next(error);
        }

        const STATUS = error.status || error.httpCode || HTTP_RESPONSE_STATUS.INTERNAL_SERVER_ERROR;
        const MESSAGE = error?.message ?? TranslationService.translate(HTTP_RESPONSE_MESSAGE[STATUS]);
        const HTTP_RESPONSE: IHttpResponse<null> = {
            data: null,
            messageList: [
                {
                    type: HTTP_RESPONSE_MESSAGE_TYPE[STATUS],
                    content: MESSAGE,
                },
            ],
        };

        response.status(STATUS).send(HTTP_RESPONSE);
    }
}
