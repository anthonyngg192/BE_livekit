import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './models/user.model';
import { DatabaseName } from 'src/common/base/constants';
import { UserRepository } from './user.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }], DatabaseName.BINANCE)],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserRepositoryModule {}
