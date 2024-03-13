import { BaseRepository } from 'src/common/base/base.repository';
import { DatabaseName } from 'src/common/base/constants';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomDoc, RoomModel } from './models/room.model';
@Injectable()
export class RoomRepository extends BaseRepository<RoomDoc, RoomModel> {
  constructor(
    @InjectModel(RoomModel.name, DatabaseName.BINANCE) public override readonly model: Model<RoomDoc>,
  ) {
    super();
  }
}
