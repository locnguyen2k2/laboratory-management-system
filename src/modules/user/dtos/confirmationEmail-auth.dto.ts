import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "./../../../globals/base.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmationEmailDto extends BaseDto {

    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    token: string;
}