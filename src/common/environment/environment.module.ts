import { AppEnvironmentService } from './environment.service';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

@Global()
@Module({
  providers: [AppEnvironmentService],
  exports: [AppEnvironmentService],
})
export class EnvironmentModule {
  static register<R extends AppEnvironmentService>(EnvironmentServiceProvider: Provider<R>): DynamicModule {
    return {
      providers: [EnvironmentServiceProvider],
      exports: [EnvironmentServiceProvider],
      module: EnvironmentModule,
    };
  }
}
