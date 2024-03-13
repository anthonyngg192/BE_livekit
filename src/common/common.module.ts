import { DynamicModule, Global, Module } from '@nestjs/common';
import { EnvironmentModule } from './environment';
import { LogModel, LogSchema } from './log/models/log.model';
import { RequestModule } from './request/request.module';
import { DatabaseName } from './base/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { LogRepository } from './log/repository/log.repository';
import { RequestLoggerMiddleware } from './middlewares';
import { ResponseModule } from './response/response.module';

@Global()
@Module({
  imports: [
    EnvironmentModule,
    MongooseModule.forFeature([{ name: LogModel.name, schema: LogSchema }], DatabaseName.BINANCE),
    RequestModule,
    ResponseModule,
  ],
  providers: [LogRepository, RequestLoggerMiddleware],
  exports: [LogRepository, RequestLoggerMiddleware],
})
export class CommonModule {
  static forRoot(): DynamicModule {
    return {
      imports: [
        EnvironmentModule,
        MongooseModule.forFeature([{ name: LogModel.name, schema: LogSchema }], DatabaseName.BINANCE),
        RequestModule,
        ResponseModule,
      ],
      module: CommonModule,
      providers: [LogRepository, RequestLoggerMiddleware],
      exports: [LogRepository, RequestLoggerMiddleware],
    };
  }
}
