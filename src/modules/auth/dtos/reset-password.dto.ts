import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ResetPaswordDto {
    @ApiProperty({ default: "" })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}