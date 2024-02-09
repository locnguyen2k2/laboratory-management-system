import { IsEmail, IsNotEmpty } from "class-validator";

export class ResetPaswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}