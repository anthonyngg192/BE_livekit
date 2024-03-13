import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateRoomDocs {
  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  allowJoined: boolean;
}
