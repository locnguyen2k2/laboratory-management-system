import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { BaseDto } from "src/globals/base.dto";

export class LoginAuthDto {

    @ApiProperty({ default: "" })
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @Length(8, 32)
    @IsNotEmpty()
    password: string;

}