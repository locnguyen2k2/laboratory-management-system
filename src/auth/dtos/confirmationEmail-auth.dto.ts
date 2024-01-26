import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmationEmailDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}