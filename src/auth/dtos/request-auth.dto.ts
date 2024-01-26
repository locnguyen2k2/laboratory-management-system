import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RequestAuthDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
    @IsEmail()
    @IsNotEmpty()
    email: string;
}