import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator"
import { BaseDto } from "src/globals/base.dto";

export class RegisterUserDto extends BaseDto {

    @ApiProperty({ default: "" })
    @IsString()
    @IsNotEmpty()
    @Expose()
    firstName: string;

    @ApiProperty({ default: "" })
    @IsString()
    @IsNotEmpty()
    @Expose()
    lastName: string;

    @ApiProperty({ default: "" })
    @IsEmail()
    @IsNotEmpty()
    @Expose()
    email: string;

    @ApiProperty({ default: "" })
    @IsPhoneNumber('VN')
    @IsNotEmpty()
    @Expose()
    phone: string;

    @ApiProperty({ default: "Tra Vinh" })
    @IsString()
    @IsNotEmpty()
    @Expose()
    address: string;

    @ApiProperty({ default: "" })
    @IsString()
    @Length(8, 32)
    @IsNotEmpty()
    @Expose()
    password: string;

    @ApiProperty({ default: "" })
    @IsString()
    @Length(8, 32)
    @IsNotEmpty()
    @Expose()
    confirmPassword: string;

}