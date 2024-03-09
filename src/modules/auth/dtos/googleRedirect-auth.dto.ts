import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "./../../../globals/base.dto";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GoogleRedirectDto extends BaseDto {

    @ApiProperty({ default: "" })
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    email: string
    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    firstName: string;
    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    lastName: string;
    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    photo: string;
    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}