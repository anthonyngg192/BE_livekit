import { Module } from '@nestjs/common';
import { RoomController } from 'src/modules/room/controllers/room.controller';
import { RoomModule } from 'src/modules/room/room.module';

@Module({
  imports: [RoomModule],
  controllers: [RoomController],
})
export class RoomRoutesModule {}
