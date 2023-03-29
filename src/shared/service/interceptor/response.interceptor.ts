import { HTTP_RESPONSE_MESSAGE, HTTP_RESPONSE_MESSAGE_TYPE, HTTP_RESPONSE_STATUS } from '@constant/http.constant';
import { IHttpResponse } from '@model/http-response/http-response.model';
import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';
import { Service } from 'typedi';

@Interceptor()
@Service()
export class ResponseInterceptor implements InterceptorInterface {
    intercept(action: Action, content: unknown): IHttpResponse<unknown> {
        const status = HTTP_RESPONSE_STATUS.SUCCESS;
        const message = HTTP_RESPONSE_MESSAGE[status];
        const httpResponse: IHttpResponse<unknown> = {
            data: content,
            messageList: [
                {
                    type: HTTP_RESPONSE_MESSAGE_TYPE[status],
                    content: message,
                },
            ],
        };

        return httpResponse;
    }
}
