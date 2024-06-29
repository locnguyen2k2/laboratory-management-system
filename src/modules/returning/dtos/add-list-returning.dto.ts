import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ItemStatusEnum } from '../../../enums/item-status-enum.enum';
import { BaseDto } from '../../../common/dtos/base.dto';
import { BaseStatusEnum } from '../../../enums/base-status.enum';

export class ReturningDto {
  @ApiProperty({ default: 0, nullable: false })
  @Expose()
  registrationId: number;

  @ApiProperty({ default: 0, nullable: false })
  @Expose()
  itemRegistrationId: number;

  @ApiProperty({ default: 1 })
  @Expose()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ default: null })
  @Expose()
  @IsNumber()
  @IsOptional()
  remaining_volume: number;

  @ApiProperty({ default: ItemStatusEnum.NORMALOPERATION })
  @Expose()
  @IsEnum(ItemStatusEnum)
  itemStatus: ItemStatusEnum;

  @ApiProperty({ default: '', nullable: true })
  @Expose()
  remark: string;
}

export class AddListReturningDto extends BaseDto {
  @Expose()
  createBy: number;

  @Expose()
  updateBy: number;

  @ApiProperty({ default: 0, nullable: false })
  @Expose()
  uid: number;

  @ApiProperty({ default: BaseStatusEnum.UNMANAGED })
  @Expose()
  @IsEnum(BaseStatusEnum)
  status: BaseStatusEnum;

  @ApiProperty({
    default: [
      {
        registrationId: 0,
        itemRegistrationId: 0,
        remaining_volume: 0,
        quantity: 0,
        remark: '',
        itemStatus: ItemStatusEnum.STILLINGOODUSE,
      },
    ],
  })
  @Expose()
  @IsNotEmpty()
  items: ReturningDto[];

  @Expose()
  date_returning: number;
}
