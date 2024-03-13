import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [],
})
export class JobsModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [];
    imports.push(ScheduleModule.forRoot());
    return {
      module: JobsModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
