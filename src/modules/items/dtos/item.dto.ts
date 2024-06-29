import { ApiProperty } from '@nestjs/swagger';

export class ItemDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  createBy: number;
  @ApiProperty()
  updateBy: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  origin: string;

  @ApiProperty()
  serial_number: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  volume: number;

  @ApiProperty()
  total_volume: number;

  @ApiProperty()
  remaining_volume: number;

  @ApiProperty()
  specification: number;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  unit: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  handover: number;
}
