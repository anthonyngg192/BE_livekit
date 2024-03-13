import { Module } from '@nestjs/common';
import { LivekitService } from './services/livekit.service';
import { LivekitController } from './controllers/livekit.controller';

@Module({
  providers: [LivekitService],
  controllers: [LivekitController],
})
export class LivekitModule {}
