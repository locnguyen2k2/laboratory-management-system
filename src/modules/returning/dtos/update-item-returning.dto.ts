import { BaseDto } from '../../../common/dtos/base.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseStatusEnum } from '../../../enums/base-status.enum';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { ItemStatusEnum } from '../../../enums/item-status-enum.enum';

export class UpdateItemReturningDto extends BaseDto {
  @Expose()
  updateBy: number;

  @Expose()
  itemRegistrationId: number;

  @ApiProperty({ default: BaseStatusEnum.UNMANAGED })
  @Expose()
  @IsEnum(BaseStatusEnum)
  status: BaseStatusEnum;

  @ApiProperty({ default: ItemStatusEnum.NORMALOPERATION })
  @Expose()
  @IsEnum(ItemStatusEnum)
  itemStatus: ItemStatusEnum;

  @Expose()
  @IsNumber()
  @Min(0)
  quantity: number;

  @Expose()
  remark: string;
}
