import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { BaseDto } from "src/common/dtos/base.dto";
import { CategoryEnum } from "src/modules/categories/category.constant";

export class UpdateItemDto extends BaseDto {
    @ApiProperty({ default: "null" })
    @Expose()
    @IsString()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: null })
    @Expose()
    @IsNumber()
    @Min(0)
    quantity: number;

    @Expose()
    updateBy: number;

    @ApiProperty({ default: null })
    @Expose()
    @IsNotEmpty()
    @IsEnum(CategoryEnum)
    categoryId: number;
}