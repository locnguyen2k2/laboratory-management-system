import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Min, Validate } from 'class-validator';
import { IsValidString } from 'src/common/decorators/string-validation.decorator';
import { BaseDto } from 'src/common/dtos/base.dto';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';
import { UnitEnum } from 'src/enums/unit-enum.enum';
import { HandoverStatus } from '../../../enums/handover-status-enum.enum';

export class UpdateItemHandoverStatusDto extends BaseDto {
  @ApiProperty({ default: HandoverStatus.IsHandover })
  @Expose()
  @IsEnum(HandoverStatus)
  handoverStatus: HandoverStatus;
}

export class UpdateItemDto extends BaseDto {
  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @Validate(IsValidString)
  name: string;

  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @Validate(IsValidString)
  origin: string;

  @ApiProperty({ default: '' })
  @Expose()
  serial_number: string;

  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @Validate(IsValidString)
  specification: string;

  @ApiProperty({ default: null })
  @Expose()
  @IsEnum(UnitEnum)
  unit: UnitEnum;

  @ApiProperty({ default: null })
  @Expose()
  @IsEnum(ItemStatusEnum)
  status: ItemStatusEnum;

  @ApiProperty({ default: '' })
  @Expose()
  remark: string;

  @Expose()
  updateBy: number;

  @ApiProperty({ default: null })
  @Expose()
  categoryId: number;
}
