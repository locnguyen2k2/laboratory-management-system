import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { ToolStatus } from "./ToolStatus";

export class AddToolDto {
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

    @ApiProperty({ default: null })
    @Expose()
    @IsNotEmpty()
    @IsEnum(ToolStatus)
    status: number;

    @ApiProperty({ default: null })
    @Expose()
    remark: string;

    @ApiProperty({ default: null })
    @Expose()
    createBy: number;

    @ApiProperty({ default: null })
    @Expose()
    updateBy: number;
}