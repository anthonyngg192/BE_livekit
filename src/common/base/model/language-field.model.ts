import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

@Schema({ _id: null, id: null })
export class LanguageFieldModel {
  @ApiProperty()
  @Prop()
  @IsNotEmpty()
  vi: string;

  @ApiProperty()
  @Prop()
  @Transform((params) => {
    params.value = params.value || params.obj.vi;
  })
  @IsOptional()
  en: string;
}

export const LanguageFieldSchema = SchemaFactory.createForClass(LanguageFieldModel);
