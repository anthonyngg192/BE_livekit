import * as Reflect from 'reflect-metadata';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

Reflect;
export class EnvironmentParam {
  @IsNumber()
  @Type(() => Number)
  @Expose()
  public API_PORT: number;

  @IsString()
  @Type(() => String)
  @Expose()
  public APP_NAME: string;

  @IsString()
  @Type(() => String)
  @Expose()
  public LIVEKIT_API_KEY: string;

  @IsString()
  @Type(() => String)
  @Expose()
  public LIVEKIT_API_SECRET: string;

  @IsString()
  @Type(() => String)
  @Expose()
  public REDIS_CONNECTION_STRING = 'redis://127.0.0.1:6379';

  @IsString()
  @Type(() => String)
  @Expose()
  public DB_CONNECTION: string;

  @IsString()
  @Type(() => String)
  @Expose()
  public JWT_SECRET_KEY: string;

  @IsString()
  @Type(() => String)
  @Expose()
  public LIVEKIT_HOST: string;
}
