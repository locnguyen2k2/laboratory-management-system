import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ItemDto } from 'src/modules/items/dtos/item.dto';
import { RoomDto } from 'src/modules/rooms/dtos/room.dto';

export class RoomItemDto {
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
  quantity: number;
  @ApiProperty()
  year: string;
  @ApiProperty()
  remark: string;
  @ApiProperty()
  @Type(() => ItemDto)
  item: ItemDto;
  @ApiProperty()
  @Type(() => RoomDto)
  room: RoomDto;
}
