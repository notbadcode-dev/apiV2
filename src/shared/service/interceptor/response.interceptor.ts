import { HTTP_RESPONSE_MESSAGE, HTTP_RESPONSE_MESSAGE_TYPE, HTTP_RESPONSE_STATUS } from '@constant/http.constant';
import { IHttpResponse } from '@model/http-response/http-response.model';
import TranslationService from '@service/translate.service';
import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';
import { Service } from 'typedi';

@Interceptor()
@Service()
export class ResponseInterceptor implements InterceptorInterface {
    intercept(action: Action, content: unknown): IHttpResponse<unknown> {
        const STATUS = HTTP_RESPONSE_STATUS.SUCCESS;
        const MESSAGE = TranslationService.translate(HTTP_RESPONSE_MESSAGE[STATUS]);
        const HTTP_RESPONSE: IHttpResponse<unknown> = {
            data: content,
            messageList: [
                {
                    type: HTTP_RESPONSE_MESSAGE_TYPE[STATUS],
                    content: MESSAGE,
                },
            ],
        };

        return HTTP_RESPONSE;
    }
}
