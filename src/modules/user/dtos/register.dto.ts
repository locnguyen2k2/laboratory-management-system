import { Expose, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { UserPasswordDto } from "./password.dto";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, Length, Validate } from "class-validator"
import { RoleEnum } from "src/enums/role-enum.enum";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { UserStatus } from "../user.constant";

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

    @Expose()
    @IsString()
    @Validate(IsValidString)
    address: string;
}

export class RegisterAdminDto extends RegisterUserDto {

    @ApiProperty({ description: 'Unactive is set as default!', default: UserStatus.UNACTIVE })
    @Expose()
    @IsEnum(UserStatus)
    status: UserStatus

    @Expose()
    @IsEnum(RoleEnum)
    @Transform(() => RoleEnum.ADMIN)
    role: RoleEnum;
}

export class RegisterManagerDto extends RegisterUserDto {
    @ApiProperty({ description: 'Unactive is set as default!', default: UserStatus.UNACTIVE })
    @Expose()
    @IsEnum(UserStatus)
    status: UserStatus

    @Expose()
    @IsEnum(RoleEnum)
    @Transform(() => RoleEnum.MANAGER)
    role: RoleEnum;
}