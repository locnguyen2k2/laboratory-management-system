import { Expose, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { UserPasswordDto } from "./password.dto";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator"
import { RoleEnum } from "src/common/enums/role.enum";

export class RegisterUserDto extends UserPasswordDto {
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
    confirmPassword: string;
}

export class RegisterAdminDto extends RegisterUserDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsEnum(RoleEnum)
    @Transform(() => RoleEnum.ADMIN)
    role: RoleEnum;
}

export class RegisterManagerDto extends RegisterUserDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsEnum(RoleEnum)
    @Transform(() => RoleEnum.MANAGER)
    role: RoleEnum;
}