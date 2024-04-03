import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, Validate, IsNumber, Min, IsEnum } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { ToolStatus } from "./../tools.constant";
import { BaseDto } from "src/common/dtos/base.dto";

export class UpdateToolDto extends BaseDto {
    @ApiProperty({ default: "null" })
    @Expose()
    @IsString()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: 1 })
    @Expose()
    @IsNumber()
    @Min(0)
    quantity: number;

    @ApiProperty({ default: ToolStatus.AVAILABLE })
    @Expose()
    @IsEnum(ToolStatus)
    status: number;

    @ApiProperty({ default: null })
    @Expose()
    updateBy: number;
}