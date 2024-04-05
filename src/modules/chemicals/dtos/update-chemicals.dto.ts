import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, IsNotEmpty, Validate, IsNumber, Min, IsEnum } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { ChemicalStatus } from "./../chemicals.constant";
import { BaseDto } from "src/common/dtos/base.dto";

export class UpdateChemicalDto extends BaseDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: null })
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
    updateBy: number;
}