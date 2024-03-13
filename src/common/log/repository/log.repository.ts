import { BaseRepository } from 'src/common/base/base.repository';
import { DatabaseName } from 'src/common/base/constants';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogDoc, LogModel } from '../models/log.model';
import { Model } from 'mongoose';

@Injectable()
export class LogRepository extends BaseRepository<LogDoc, LogModel> {
  constructor(
    @InjectModel(LogModel.name, DatabaseName.BINANCE) public override readonly model: Model<LogDoc>,
  ) {
    super();
  }
}
