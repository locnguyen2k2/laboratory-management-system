import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, Length, Matches } from "class-validator"
import { RoleEnum } from "src/auth/enums/role.enum";

export class RegisterAdminDto {

    @ApiProperty({ default: "Loc" })
    @IsString()
    @IsNotEmpty()
    @Expose()
    firstName: string;

    @ApiProperty({ default: "Nguyen" })
    @IsString()
    @IsNotEmpty()
    @Expose()
    lastName: string;

    @ApiProperty({ default: "locnguyen071102@gmail.com" })
    @IsEmail()
    @IsNotEmpty()
    @Expose()
    email: string;

    @ApiProperty({ default: "0327688962" })
    @IsPhoneNumber('VN')
    @IsNotEmpty()
    @Expose()
    phone: string;

    @ApiProperty({ default: "Tra Vinh" })
    @IsString()
    @IsNotEmpty()
    @Expose()
    address: string;

    @ApiProperty({ default: "07112002NTLoc" })
    @IsString()
    @Length(8, 32)
    @IsNotEmpty()
    @Expose()
    password: string;

    @ApiProperty({ default: "07112002NTLoc" })
    @IsString()
    @Length(8, 32)
    @IsNotEmpty()
    @Expose()
    confirmPassword: string;

    @IsEnum(RoleEnum)
    @Expose()
    role: RoleEnum.ADMIN;
}