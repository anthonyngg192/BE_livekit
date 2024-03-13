import { Module } from '@nestjs/common';
import { LivekitService } from './services/livekit.service';

@Module({
  providers: [LivekitService],
  exports: [LivekitService],
  controllers: [],
})
export class LivekitModule {}
