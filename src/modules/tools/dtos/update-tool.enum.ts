import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, Validate, IsNumber, Min, IsEnum } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { ToolStatus } from "./ToolStatus";

export class UpdateToolDto {
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

    @ApiProperty({ default: null })
    @Expose()
    @IsEnum(ToolStatus)
    status: number;

    @ApiProperty({ default: null })
    @Expose()
    updateBy: number;
}