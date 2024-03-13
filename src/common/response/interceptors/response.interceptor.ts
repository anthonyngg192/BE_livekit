import { BadRequestException, Injectable } from '@nestjs/common';
import { CallHandler, ExecutionContext, HttpException, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { SYSTEM_CORE_CODE } from '../../base/constants';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../base/model';
import { Response } from 'express';
import { ReturnErrorModel } from '../../base/model/return-error.model';
import { ReturnOKModel } from '../../base/model/return-ok.model';

@Injectable()
export class ResponseInterceptor implements NestInterceptor<ReturnOKModel<any> | any, ResponseModel<any>> {
  protected logger = new Logger(this.constructor.name);
  public systemCodeJsonFilePath = 'system-code';
  public appCodeJsonFilePath = 'app-code';

  intercept(
    context: ExecutionContext,
    next: CallHandler<ReturnOKModel<any> | any>,
  ): Observable<ResponseModel<any>> | Promise<Observable<ResponseModel<any>>> {
    const res: Response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((response: ReturnOKModel<any> | any) => {
        if (response instanceof ReturnOKModel) {
          return {
            data: response.data,
            message: null,
            statusCode: null,
          } as ResponseModel<any>;
        }

        return {
          data: response,
          message: null,
          statusCode: null,
        } as ResponseModel<any>;
      }),
      catchError(async (err: ReturnErrorModel | HttpException | Error | BadRequestException) => {
        let httpCode = res.statusCode;
        let statusCode = SYSTEM_CORE_CODE.SORRY_SOMETHING_WENT_WRONG;
        let errorStack = err['stack'];
        let responseValidators = [];

        if (err instanceof BadRequestException) {
          const validators = (err.getResponse() as any)?.message;
          responseValidators = validators.map((x) => ({ property: x.property, constraints: x.constraints }));
          httpCode = 400;
          errorStack = undefined;
        } else if (err instanceof HttpException) {
          httpCode = err && err.getStatus ? err.getStatus() : httpCode;
        } else {
          statusCode = err['message'] || statusCode;
        }

        switch (httpCode) {
          case 400:
            statusCode = SYSTEM_CORE_CODE.BAD_REQUEST;
            break;

          case 401:
            statusCode = SYSTEM_CORE_CODE.UNAUTHORIZED;
            break;

          case 403:
            statusCode = SYSTEM_CORE_CODE.FORBIDDEN;
            break;
        }

        res.status(httpCode);

        this.logger.error(err);

        return {
          data: null,
          message: '',
          statusCode: statusCode,
          stack: errorStack,
          validators: responseValidators,
        } as ResponseModel<any>;
      }),
    );
  }
}
