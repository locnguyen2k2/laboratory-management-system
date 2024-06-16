import { IsEnum, IsObject } from 'class-validator';
import { BaseStatusEnum } from '../../../enums/base-status.enum';
import { ItemStatusEnum } from '../../../enums/item-status-enum.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ItemReturningDto {
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
  @IsEnum(BaseStatusEnum)
  status: BaseStatusEnum;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  date_returning: number;
  @ApiProperty()
  remark: string;
  @ApiProperty()
  @IsObject()
  itemRegistration: {
    id: number;
  };
  @ApiProperty()
  @IsEnum(ItemStatusEnum)
  itemStatus: ItemStatusEnum;
}
