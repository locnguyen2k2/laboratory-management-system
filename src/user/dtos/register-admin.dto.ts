import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, Length, Matches } from "class-validator"
import { RoleEnum } from "src/auth/enums/role.enum";
import { BaseDto } from "src/globals/base.dto";
import { RegisterUserDto } from "./register-user.dto";

export class RegisterAdminDto extends RegisterUserDto {

    @Expose()
    @IsEnum(RoleEnum)
    @Transform(() => RoleEnum.ADMIN)
    role: RoleEnum;
}