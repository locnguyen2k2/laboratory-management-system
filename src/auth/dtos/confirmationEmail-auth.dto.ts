import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "src/globals/base.dto";

export class ConfirmationEmailDto extends BaseDto {

    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    token: string;
}