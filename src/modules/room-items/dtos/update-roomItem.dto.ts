import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, Length, Min } from 'class-validator';
import { BaseDto } from 'src/common/dtos/base.dto';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';

export class UpdateRoomItemDto extends BaseDto {
  @ApiProperty({ default: null })
  @Expose()
  roomId?: number;

  @ApiProperty({ default: null })
  @Expose()
  itemId?: number;

  @ApiProperty({ default: ItemStatusEnum.NORMALOPERATION })
  @Expose()
  @IsEnum(ItemStatusEnum)
  @IsOptional()
  status?: ItemStatusEnum;

  @ApiProperty({ default: null })
  @Min(0)
  @Expose()
  quantity?: number;

  @ApiProperty({ default: '' })
  @Expose()
  @IsOptional()
  @Length(4)
  year?: string;

  @ApiProperty({ default: '' })
  @Expose()
  @IsOptional()
  remark?: string;

  @Expose()
  @IsOptional()
  updateBy?: number;
}
