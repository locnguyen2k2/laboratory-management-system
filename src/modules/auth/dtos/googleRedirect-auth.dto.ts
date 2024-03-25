import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GoogleRedirectDto {

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
    photo: string;
    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}