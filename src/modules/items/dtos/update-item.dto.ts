import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsValidString } from 'src/common/decorators/string-validation.decorator';
import { BaseDto } from 'src/common/dtos/base.dto';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';
import { UnitEnum } from 'src/enums/unit-enum.enum';

export class UpdateItemDto extends BaseDto {
  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @Validate(IsValidString)
  @IsOptional()
  name?: string;

  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @Validate(IsValidString)
  @IsOptional()
  origin?: string;

  @ApiProperty({ default: '' })
  @Expose()
  @IsOptional()
  serial_number?: string;

  @ApiProperty({ default: null })
  @Expose()
  @IsEnum(UnitEnum)
  @IsOptional()
  specification?: UnitEnum;

  @ApiProperty({ default: null })
  @Expose()
  @IsEnum(UnitEnum)
  @IsOptional()
  unit?: UnitEnum;

  @ApiProperty({ default: null })
  @Expose()
  @IsEnum(ItemStatusEnum)
  @IsOptional()
  status?: ItemStatusEnum;

  @ApiProperty({ default: null })
  @Expose()
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({ default: null })
  @Expose()
  @IsNumber()
  @IsOptional()
  volume?: number;

  @ApiProperty({ default: null })
  @Expose()
  @IsNumber()
  @IsOptional()
  total_volume?: number;

  @ApiProperty({ default: null })
  @Expose()
  @IsNumber()
  @IsOptional()
  remaining_volume?: number;

  @ApiProperty({ default: '' })
  @Expose()
  @IsOptional()
  remark?: string;

  @Expose()
  @IsOptional()
  updateBy?: number;

  @ApiProperty({ default: null })
  @Expose()
  @IsOptional()
  categoryId?: number;
}
