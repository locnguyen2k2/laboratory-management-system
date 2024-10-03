import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { BaseDto } from 'src/common/dtos/base.dto';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';

export class AddRoomItemDto extends BaseDto {
  @ApiProperty({ default: '' })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @ApiProperty({ default: '' })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @ApiProperty({ default: ItemStatusEnum.NORMALOPERATION })
  @Expose()
  @IsNotEmpty()
  @IsEnum(ItemStatusEnum)
  status: ItemStatusEnum;

  @ApiProperty({ default: '' })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @Expose()
  createBy: number;
  @Expose()
  updateBy: number;
}

export class AddListRoomItemDto extends BaseDto {
  @ApiProperty({
    default: [
      {
        roomId: null,
        itemId: null,
        status: null,
        quantity: null,
      },
    ],
  })
  @Expose()
  @Type(() => AddRoomItemDto)
  @ValidateNested()
  room_items: AddRoomItemDto[];

  @Expose()
  createBy: number;
  @Expose()
  updateBy: number;
}
