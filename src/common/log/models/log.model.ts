import { assignIn } from 'lodash';
import { BaseModel } from 'src/common/base/model/base.model';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LogDoc = LogModel & Document;

@Schema({ collection: 'logs', versionKey: false })
export class LogModel extends BaseModel {
  @Prop({ index: true })
  url: string;

  @Prop()
  requestBody: string;

  @Prop()
  responseBody: string;

  @Prop()
  status: number;

  @Prop()
  duration: number;

  @Prop()
  method: string;

  @Prop({ type: Date, default: new Date(), index: { expires: 432000 } })
  time: Date;

  @Prop()
  header: string;

  constructor(dto = null) {
    super();
    assignIn(this, dto);
  }
}

export const LogSchema = SchemaFactory.createForClass(LogModel);
