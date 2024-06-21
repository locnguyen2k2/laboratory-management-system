import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, Length, Min } from 'class-validator';
import { BaseDto } from 'src/common/dtos/base.dto';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';

export class TransferRoomItemDto extends BaseDto {
  @ApiProperty({ default: 0 })
  @Expose()
  roomId: number;

  @ApiProperty({ default: 0 })
  @Expose()
  itemId: number;

  @ApiProperty({ default: ItemStatusEnum.NORMALOPERATION })
  @Expose()
  @IsEnum(ItemStatusEnum)
  status?: ItemStatusEnum;

  @ApiProperty({ default: 1 })
  @Min(1)
  @Expose()
  quantity: number;

  @ApiProperty({ default: `${new Date().getFullYear()}` })
  @Expose()
  @Length(4)
  year: string;

  @ApiProperty({ default: '' })
  @Expose()
  remark: string;

  @Expose()
  updateBy: number;
}
