import { BaseDto } from '../../../common/dtos/base.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseStatusEnum } from '../../../enums/base-status.enum';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { ItemStatusEnum } from '../../../enums/item-status-enum.enum';

export class UpdateItemReturningDto extends BaseDto {
  @Expose()
  updateBy: number;

  @Expose()
  @IsOptional()
  itemRegistrationId?: number;

  @Expose()
  @IsOptional()
  registrationId?: number;

  @Expose()
  @IsOptional()
  uid?: number;

  @ApiProperty({ default: BaseStatusEnum.UNMANAGED })
  @Expose()
  @IsEnum(BaseStatusEnum)
  @IsOptional()
  status?: BaseStatusEnum;

  @ApiProperty({ default: ItemStatusEnum.NORMALOPERATION })
  @Expose()
  @IsEnum(ItemStatusEnum)
  @IsOptional()
  itemStatus?: ItemStatusEnum;

  @Expose()
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @Expose()
  @IsOptional()
  remark?: string;
}
