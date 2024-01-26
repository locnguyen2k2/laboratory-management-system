import { IsEmail, IsNotEmpty } from "class-validator";

export class EmailLinkConfirmDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}