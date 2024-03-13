import { Logger } from '@nestjs/common';
import { ReturnErrorModel, ReturnOKModel } from './model';
import { SYSTEM_CORE_CODE } from './constants';
import { v4 } from 'uuid';

export abstract class BaseService {
  private traceId: string;
  public getTraceId(): string {
    return this.traceId;
  }
  protected readonly logger = new Logger(this.constructor.name);

  public initLoggerTraceId(traceId: string = v4()) {
    this.traceId = traceId;
    return this;
  }

  ok<T>(data: T = null): ReturnOKModel<T> {
    return new ReturnOKModel(data);
  }

  error(statusCode = SYSTEM_CORE_CODE.INTERNAL_SERVER_ERROR, params?: any): ReturnErrorModel {
    throw new ReturnErrorModel(statusCode, params);
  }
}
