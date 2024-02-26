import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RequestAuthDto {
    @ApiProperty({ default: "" })
    @IsNumber()
    @IsNotEmpty()
    id: number;
    @ApiProperty({ default: "" })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}