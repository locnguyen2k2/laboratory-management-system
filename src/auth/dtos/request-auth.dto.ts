import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BaseDto } from "src/globals/base.dto";

export class RequestAuthDto extends BaseDto {
    @ApiProperty({ default: "" })
    @IsNumber()
    @IsNotEmpty()
    id: number;
    @ApiProperty({ default: "" })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}