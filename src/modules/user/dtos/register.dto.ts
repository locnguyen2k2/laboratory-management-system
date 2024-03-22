import { Expose, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { UserPasswordDto } from "./password.dto";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, Length, Validate } from "class-validator"
import { UserRole } from "./../user.constant";
import { IsValidString } from "src/common/decorators/string-validation.decorator";

export class RegisterUserDto extends UserPasswordDto {
    @ApiProperty({ default: "" })
    @IsString()
    @IsNotEmpty()
    @Expose()
    @Validate(IsValidString)
    firstName: string;

    @ApiProperty({ default: "" })
    @IsString()
    @IsNotEmpty()
    @Expose()
    @Validate(IsValidString)
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
    @Validate(IsValidString)
    address: string;

    @ApiProperty({ default: "" })
    @IsString()
    @Length(8, 32)
    @IsNotEmpty()
    @Expose()
    confirmPassword: string;
}

export class RegisterAdminDto extends RegisterUserDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsEnum(UserRole)
    @Transform(() => UserRole.ADMIN)
    roles: UserRole;
}

export class RegisterManagerDto extends RegisterUserDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsEnum(UserRole)
    @Transform(() => UserRole.MANAGER)
    roles: UserRole;
}