import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { BaseDto } from "src/common/dtos/base.dto";

export class UpdateItemDto extends BaseDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: null })
    @Expose()
    @IsNumber()
    @Min(0)
    quantity: number;

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
    unitId: number;

    @ApiProperty({ default: "" })
    @Expose()
    remark: string;


    @Expose()
    updateBy: number;

    @ApiProperty({ default: null })
    @Expose()
    categoryId: number;
}