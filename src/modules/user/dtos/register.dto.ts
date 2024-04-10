import { Expose, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { UserPasswordDto } from "./password.dto";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, Length, Validate } from "class-validator"
import { RoleEnum } from "src/enums/role-enum.enum";
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
    @Expose()
    @IsEnum(RoleEnum)
    @Transform(() => RoleEnum.ADMIN)
    role: RoleEnum;
}

export class RegisterManagerDto extends RegisterUserDto {
    @Expose()
    @IsEnum(RoleEnum)
    @Transform(() => RoleEnum.MANAGER)
    role: RoleEnum;
}