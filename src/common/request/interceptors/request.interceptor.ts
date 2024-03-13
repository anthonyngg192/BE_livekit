import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  async intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle();
  }
}
