import { Module } from '@nestjs/common';
import { RoomRepositoryModule } from './repositories/room.repository.module';
import { RoomService } from './services/room.service';
import { LivekitModule } from '../livekit/livekit.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, RoomRepositoryModule, LivekitModule],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
