import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseDto } from '../../../common/dtos/base.dto';
import { ItemStatusEnum } from '../../../enums/item-status-enum.enum';
import { BaseStatusEnum } from '../../../enums/base-status.enum';

export class AddItemReturningDto extends BaseDto {
  @Expose()
  createBy: number;
  @Expose()
  updateBy: number;

  @ApiProperty({ default: 0, nullable: false })
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

  @ApiProperty({ default: 1 })
  @Expose()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ default: '', nullable: true })
  @Expose()
  remark: string;

  @Expose()
  date_returning: number;
}
