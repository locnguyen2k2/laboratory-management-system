import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GoogleRedirectDto {
    @IsEmail()
    @IsNotEmpty()
    email: string
    @IsString()
    @IsNotEmpty()
    firstName: string;
    @IsString()
    @IsNotEmpty()
    lastName: string;
    @IsString()
    @IsNotEmpty()
    photo: string;
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}