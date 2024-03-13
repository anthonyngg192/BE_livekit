import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomHistoryModel, RoomHistorySchema } from './models/room-history.model';
import { DatabaseName } from 'src/common/base/constants';
import { RoomHistoryRepository } from './room-history.repository';
import { RoomRepository } from './room.repository';
import { RoomModel, RoomSchema } from './models/room.model';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: RoomHistoryModel.name, schema: RoomHistorySchema },
        { name: RoomModel.name, schema: RoomSchema },
      ],
      DatabaseName.BINANCE,
    ),
  ],
  providers: [RoomHistoryRepository, RoomRepository],
  exports: [RoomHistoryRepository, RoomRepository],
})
export class RoomRepositoryModule {}
