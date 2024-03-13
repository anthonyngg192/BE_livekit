import { BaseRepository } from 'src/common/base/base.repository';
import { DatabaseName } from 'src/common/base/constants';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDoc, UserModel } from './models/user.model';

@Injectable()
export class UserRepository extends BaseRepository<UserDoc, UserModel> {
  constructor(
    @InjectModel(UserModel.name, DatabaseName.BINANCE) public override readonly model: Model<UserDoc>,
  ) {
    super();
  }
}
