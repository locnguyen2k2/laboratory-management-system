import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, Length, Min } from 'class-validator';
import { BaseDto } from 'src/common/dtos/base.dto';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';

export class UpdateRoomItemDto extends BaseDto {
  @ApiProperty({ default: ItemStatusEnum.NORMALOPERATION })
  @Expose()
  @IsOptional()
  @IsEnum(ItemStatusEnum)
  status?: ItemStatusEnum;

  @ApiProperty({ default: 1 })
  @Min(1)
  @Expose()
  @IsOptional()
  quantity?: number;

  @ApiProperty({ default: `${new Date().getFullYear()}` })
  @Expose()
  @IsOptional()
  @Length(4)
  year?: string;

  @ApiProperty({ default: '' })
  @Expose()
  @IsOptional()
  remark?: string;

  @Expose()
  updateBy: number;
}
