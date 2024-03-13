import { BaseRepository } from 'src/common/base/base.repository';
import { DatabaseName } from 'src/common/base/constants';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomHistoryDoc, RoomHistoryModel } from './models/room-history.model';

@Injectable()
export class RoomHistoryRepository extends BaseRepository<RoomHistoryDoc, RoomHistoryModel> {
  constructor(
    @InjectModel(RoomHistoryModel.name, DatabaseName.BINANCE)
    public override readonly model: Model<RoomHistoryDoc>,
  ) {
    super();
  }
}
