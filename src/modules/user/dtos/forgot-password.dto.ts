import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "./../../../globals/base.dto";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { UserPasswordDto } from "./password.dto";

export class ForgotPasswordDto extends UserPasswordDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    digitalNumbs: string;

}