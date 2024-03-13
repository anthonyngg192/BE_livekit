import * as Reflect from 'reflect-metadata';
import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';

Reflect;
export class EnvironmentParam {

  @IsString()
  @Type(() => String)
  @Expose()
  public LIVEKIT_API_KEY: string;

  @IsString()
  @Type(() => String)
  @Expose()
  public LIVEKIT_API_SECRET: string;
}
