import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, Validate, IsNumber, Min, IsEnum, IsEmail } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { ChemicalStatus } from "./../chemicals.constant";
import { CategoryEnum } from "src/modules/categories/category.constant";
import { BaseDto } from "src/common/dtos/base.dto";

export class AddChemicalDto extends BaseDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: 1 })
    @Expose()
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ default: ChemicalStatus.AVAILABLE })
    @Expose()
    @IsNotEmpty()
    @IsEnum(ChemicalStatus)
    status: number;

    @Expose()
    createBy: number;
    @Expose()
    updateBy: number;

    @Expose()
    @Transform(() => CategoryEnum.CHEMICALS)
    categoryId: number;
}