import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {  IsNotEmpty, IsString, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { BaseDto } from "src/common/dtos/base.dto";

export class UpdateItemStatusDto extends BaseDto {
    @ApiProperty({ default: '' })
    @IsString()
    @Expose()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;
}