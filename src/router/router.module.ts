import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { AuthRoutesModule } from './routes/auth.routes.module';
import { RoomRoutesModule } from './routes/room.routes.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [];

    imports.push(
      AuthRoutesModule,
      RoomRoutesModule,
      NestJsRouterModule.register([
        {
          path: 'auth',
          module: AuthRoutesModule,
        },
        {
          path: '',
          module: RoomRoutesModule,
        },
      ]),
    );

    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
