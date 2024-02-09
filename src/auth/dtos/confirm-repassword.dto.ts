import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class ConfirmRePasswordDto {
    @ApiProperty({ default: "" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ default: "" })
    @IsString()
    @IsNotEmpty()
    digitalNumbs: string;

    @ApiProperty({ default: "" })
    @IsString()
    @Length(8, 32)
    @IsNotEmpty()
    @Expose()
    password: string;
}