import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginAuthDto {

    @ApiProperty({default: "@gmail.com"})
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({default: ""})
    @Expose()
    @IsString()
    @Length(8, 32)
    @IsNotEmpty()
    password: string;

}