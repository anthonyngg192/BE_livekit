import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, IsOptional } from 'class-validator';
import { LanguageFieldModel, LanguageFieldSchema } from './language-field.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';

@Schema({ versionKey: false, _id: null })
export class TranslatedSlugModel {
  @ApiProperty({ required: false })
  @Prop()
  @IsOptional()
  prefix?: string;

  @ApiProperty()
  @Prop({ type: LanguageFieldSchema, required: true })
  @Type(() => LanguageFieldModel)
  @IsNotEmptyObject()
  value: LanguageFieldModel;

  @ApiProperty({ required: false })
  @Prop()
  @IsOptional()
  postfix?: string;
}

export const TranslatedSlugSchema = SchemaFactory.createForClass(TranslatedSlugModel);
