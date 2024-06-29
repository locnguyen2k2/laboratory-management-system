import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsValidString } from 'src/common/decorators/string-validation.decorator';
import { CategoryEnum } from 'src/modules/categories/category.constant';
import { BaseDto } from 'src/common/dtos/base.dto';
import { UnitEnum } from './../../../enums/unit-enum.enum';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';

class AddItemBaseDto extends BaseDto {
  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Validate(IsValidString)
  name: string;

  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @Validate(IsValidString)
  @IsOptional()
  origin?: string;

  @ApiProperty({ default: '' })
  @Expose()
  @IsOptional()
  @Validate(IsValidString)
  serial_number?: string;

  @ApiProperty({ default: UnitEnum.ml })
  @Expose()
  @IsEnum(UnitEnum)
  @IsOptional()
  specification?: UnitEnum;

  @ApiProperty({ default: null })
  @Expose()
  @IsNotEmpty()
  @IsEnum(UnitEnum)
  unit: UnitEnum;

  @ApiProperty({ default: null })
  @Expose()
  @IsNotEmpty()
  @IsEnum(ItemStatusEnum)
  status: ItemStatusEnum;

  @ApiProperty({ default: '' })
  @Expose()
  @IsOptional()
  remark?: string;

  @ApiProperty({ default: 1 })
  @Expose()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ default: 1 })
  @Expose()
  @IsNumber()
  @IsOptional()
  @Min(1)
  volume?: number;

  @ApiProperty({ default: null })
  @Expose()
  @IsNotEmpty()
  @IsEnum(CategoryEnum)
  categoryId: CategoryEnum;
}

export class AddItemDto extends AddItemBaseDto {
  @Expose()
  createBy: number;

  @Expose()
  updateBy: number;
}

export class AddListItemDto extends BaseDto {
  @ApiProperty({
    default: [
      {
        name: '',
        origin: '',
        serial_number: '',
        specification: null,
        volume: 0,
        unit: null,
        status: null,
        quantity: null,
        remark: '',
        categoryId: null,
      },
    ],
  })
  @Expose()
  @Type(() => AddItemBaseDto)
  @ValidateNested()
  items: AddItemBaseDto[];

  @Expose()
  createBy: number;

  @Expose()
  updateBy: number;
}
