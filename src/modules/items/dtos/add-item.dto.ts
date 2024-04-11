import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { CategoryEnum } from "src/modules/categories/category.constant";
import { BaseDto } from "src/common/dtos/base.dto";
import { UnitEnum } from "./../../../enums/unit-enum.enum";
import { ItemStatusEnum } from "src/enums/item-status-enum.enum";

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
    serial_number: string;

    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @Validate(IsValidString)
    specification: string;

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

    @ApiProperty({ default: 1 })
    @Expose()
    @IsNumber()
    @Min(1)
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
    categoryId: CategoryEnum;
}