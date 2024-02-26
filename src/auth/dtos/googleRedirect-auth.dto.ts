import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GoogleRedirectDto {

    @ApiProperty({ default: "" })
    @IsEmail()
    @IsNotEmpty()
    email: string
    @ApiProperty({ default: "" })
    @IsString()
    @IsNotEmpty()
    firstName: string;
    @ApiProperty({ default: "" })
    @IsString()
    @IsNotEmpty()
    lastName: string;
    @ApiProperty({ default: "" })
    @IsString()
    @IsNotEmpty()
    photo: string;
    @ApiProperty({ default: "" })
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}