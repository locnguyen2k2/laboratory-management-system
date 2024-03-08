import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "src/globals/base.dto";

export class GoogleRedirectDto extends BaseDto {

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