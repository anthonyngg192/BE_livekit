import { CacheConnection } from './cache.connection';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ModelCacheService } from './model-cache.service';

const services = [ModelCacheService];

@Global()
@Module({
  providers: [],
  exports: [],
})
export class AppCacheModule {
  static forRoot(connectionProvider: Provider<CacheConnection>): DynamicModule {
    return {
      module: AppCacheModule,
      providers: [...services, connectionProvider],
      exports: services,
    };
  }
}
