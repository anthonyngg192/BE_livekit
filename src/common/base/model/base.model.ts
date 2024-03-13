import { ApiResponseProperty } from '@nestjs/swagger';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export abstract class BaseModel {
  @ApiResponseProperty({ type: String })
  _id?: string;

  @ApiResponseProperty()
  @Prop({ type: Number, index: true })
  createdAt?: number;

  @ApiResponseProperty()
  @Prop({ type: Number, index: true })
  updatedAt?: number;

  @Prop({ type: Boolean, index: true })
  default?: boolean;
}
