import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { LANGUAGE } from '../enums';
import { Prop } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

export class MultiLanguageModel {
  @ApiProperty({ required: false })
  @Prop({ required: true })
  @Transform((obj) => (obj.value ? obj.value : obj.obj[LANGUAGE.VI]))
  @IsOptional()
  [LANGUAGE.EN]: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Prop({ required: false })
  [LANGUAGE.VI]: string;
}
