import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';
import { BaseModel } from 'src/common/base/model/base.model';

export type RoomDoc = RoomModel & Document;

@Schema({ collection: 'rooms', versionKey: false })
export class RoomModel extends BaseModel {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Prop()
  roomName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId })
  owner: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @Prop({ type: [SchemaTypes.ObjectId], default: [] })
  participants: string[] = [];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Prop({ required: false, type: SchemaTypes.Number })
  endAt?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Prop({ type: SchemaTypes.Boolean, default: true })
  allowJoined = false;
}

export const RoomSchema = SchemaFactory.createForClass(RoomModel);
