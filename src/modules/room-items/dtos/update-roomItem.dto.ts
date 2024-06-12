import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { BaseDto } from 'src/common/dtos/base.dto';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';

export class UpdateRoomItemDto extends BaseDto {
  @ApiProperty({ default: null })
  @Expose()
  roomId: number;

  @ApiProperty({ default: null })
  @Expose()
  itemId: number;

  @ApiProperty({ default: ItemStatusEnum.NORMALOPERATION })
  @Expose()
  @IsEnum(ItemStatusEnum)
  status: ItemStatusEnum;

  @ApiProperty({ default: null })
  @Expose()
  quantity: number;

  @ApiProperty({ default: '' })
  @Expose()
  year: string;

  @ApiProperty({ default: '' })
  @Expose()
  remark: string;

  @Expose()
  updateBy: number;
}
