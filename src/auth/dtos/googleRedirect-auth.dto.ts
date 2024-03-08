import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "src/globals/base.dto";

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