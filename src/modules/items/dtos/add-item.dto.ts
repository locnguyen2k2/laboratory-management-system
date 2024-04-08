import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { CategoryEnum } from "src/modules/categories/category.constant";
import { BaseDto } from "src/common/dtos/base.dto";
import { UnitEnum } from "src/modules/units/unit.constant";

export class AddItemDto extends BaseDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @Validate(IsValidString)
    origin: string;

    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @Validate(IsValidString)
    specification: string;

    @ApiProperty({ default: null })
    @Expose()
    @IsNotEmpty()
    @IsEnum(UnitEnum)
    unitId: number;

    @ApiProperty({ default: 1 })
    @Expose()
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ default: "" })
    @Expose()
    remark: string;

    @Expose()
    createBy: number;

    @Expose()
    updateBy: number;

    @ApiProperty({ default: null })
    @Expose()
    @IsNotEmpty()
    @IsEnum(CategoryEnum)
    categoryId: number;
}