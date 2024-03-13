import { ApiProperty } from '@nestjs/swagger';
import { DATA_TYPE_ES } from '../enums/elasticsearch.enum';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@Exclude()
export class QuerySearchIndex {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @Expose()
  @IsOptional()
  @Min(1)
  page?: number;

  @IsNumber()
  @ApiProperty({
    required: false,
  })
  @Type(() => Number)
  @Expose()
  @Min(1)
  @IsOptional()
  pageSize?: number;

  @IsString()
  @Type(() => String)
  @IsOptional()
  @Expose()
  userId?: string;

  @IsString()
  @ApiProperty({
    required: false,
  })
  @Type(() => String)
  @Expose()
  @IsOptional()
  text?: string;

  @ApiProperty({ enum: DATA_TYPE_ES })
  @IsOptional()
  @IsEnum(DATA_TYPE_ES)
  @ApiProperty({ required: false })
  @Type(() => String)
  @Expose()
  dataType?: DATA_TYPE_ES;
}
