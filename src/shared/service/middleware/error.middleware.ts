import { HTTP_RESPONSE_MESSAGE, HTTP_RESPONSE_MESSAGE_TYPE, HTTP_RESPONSE_STATUS } from '@constant/http.constant';
import { IErrorMiddlewareError } from '@model/error-middleware/error-middleware-error.model';
import { IHttpResponse } from '@model/http-response/http-response.model';
import { NextFunction, Request, Response } from 'express/index';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';

@Middleware({ type: 'after' })
@Service()
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: IErrorMiddlewareError, request: Request, response: Response, next: NextFunction): void {
        if (response.headersSent) {
            next(error);
        }

        const status = error.status || error.httpCode || HTTP_RESPONSE_STATUS.INTERNAL_SERVER_ERROR;
        const message = error.message || HTTP_RESPONSE_MESSAGE[status];
        const httpResponse: IHttpResponse<null> = {
            data: null,
            messageList: [
                {
                    type: HTTP_RESPONSE_MESSAGE_TYPE[status],
                    content: message,
                },
            ],
        };

        response.status(status).send(httpResponse);
    }
}
