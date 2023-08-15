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

        const STATUS = this.getStatus(error?.status, error?.httpCode);
        const MESSAGE = this.getMessage(STATUS, error?.message);
        const MESSAGE_TYPE = HTTP_RESPONSE_MESSAGE_TYPE[STATUS];
        const HTTP_RESPONSE: IHttpResponse<null> = {
            data: null,
            messageList: [
                {
                    type: MESSAGE_TYPE,
                    content: MESSAGE,
                },
            ],
        };

        response.status(STATUS).send(HTTP_RESPONSE);
    }

    getStatus(status?: number, httpCode?: number): number {
        if (status) {
            return status;
        }

        if (httpCode) {
            return httpCode;
        }

        return HTTP_RESPONSE_STATUS.INTERNAL_SERVER_ERROR;
    }

    getMessage(status: number, message?: string): string {
        if (!message || !message?.length) {
            return TranslationService.translate(HTTP_RESPONSE_MESSAGE[status]);
        }

        return message;
    }
}
