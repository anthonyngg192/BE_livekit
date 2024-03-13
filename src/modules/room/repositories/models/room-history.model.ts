import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { BaseModel } from 'src/common/base/model/base.model';

export type RoomHistoryDoc = RoomHistoryModel & Document;

@Schema({ collection: 'RoomHistories', versionKey: false })
export class RoomHistoryModel extends BaseModel {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Prop()
  roomName: string;
}

export const RoomHistorySchema = SchemaFactory.createForClass(RoomHistoryModel);
