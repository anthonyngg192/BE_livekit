import { ApiProperty } from '@nestjs/swagger';
export class CountByModel {
  @ApiProperty({ type: String })
  _id: any;

  @ApiProperty()
  count: number;
}
