import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { AppEnvironmentService, EnvironmentModule } from 'src/common/environment';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseName } from 'src/common/base/constants';
import { RouterModule } from 'src/router/router.module';
import { JobsModule } from 'src/job/job.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (envService: AppEnvironmentService) => ({
        uri: envService.ENVIRONMENT.DB_CONNECTION,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      connectionName: DatabaseName.BINANCE,
      inject: [AppEnvironmentService],
    }),
    EnvironmentModule.register({
      provide: AppEnvironmentService,
      useValue: new AppEnvironmentService(),
    }),

    //Router
    RouterModule.forRoot(),

    //Job
    JobsModule.forRoot(),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
