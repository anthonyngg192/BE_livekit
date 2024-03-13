import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { BaseModel } from 'src/common/base/model/base.model';

export type UserDoc = UserModel & Document;

@Schema({ collection: 'users', versionKey: false })
export class UserModel extends BaseModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Prop({ unique: true })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
