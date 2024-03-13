import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LivekitModule } from './livekit/livekit.module';
import { EnvironmentModule } from './common/environment';

@Module({
  imports: [EnvironmentModule, LivekitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
