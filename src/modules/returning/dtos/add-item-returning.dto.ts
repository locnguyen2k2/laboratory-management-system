import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Min } from "class-validator";
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

  @ApiProperty({ default: 0, nullable: false })
  @Expose()
  registrationId: number;

  @ApiProperty({ default: 0, nullable: false })
  @Expose()
  uid: number;

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

  @ApiProperty({ default: 0 })
  @Expose()
  @IsNumber()
  @Min(0)
  @IsOptional()
  remaining_volume: number;

  @ApiProperty({ default: '', nullable: true })
  @Expose()
  remark: string;

  @Expose()
  date_returning: number;
}

export class AddChemicalItemReturningDto extends AddItemReturningDto {
  @ApiProperty({ default: 1 })
  @Expose()
  @IsNumber()
  @Min(0)
  quantity: number;
}
