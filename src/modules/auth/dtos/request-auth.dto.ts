import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class RequestAuthDto {
    @ApiProperty({ default: "" })
    @IsNumber()
    @IsNotEmpty()
    @Expose()
    id: number;
    @ApiProperty({ default: "" })
    @IsEmail()
    @IsNotEmpty()
    @Expose()
    email: string;
}