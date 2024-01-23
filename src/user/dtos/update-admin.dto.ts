import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { RoleEnum } from "src/auth/enums/role.enum";
import { UserStatusEnum } from "src/auth/enums/user-status.enum";
import { BaseDto } from "src/globals/base.dto";

export class UpdateAdminDto extends BaseDto {

    @ApiProperty({ default: "locnguyentan1230@gmail.com" })
    @Expose()
    @IsEmail()
    email: string;
    @ApiProperty({ default: "Steven" })
    @Expose()
    @IsString()
    firstName: string;
    @ApiProperty({ default: "Nguyen" })
    @Expose()
    @IsString()
    lastName: string;
    @ApiProperty({ default: "0322123412" })
    @Expose()
    @IsPhoneNumber('VN')
    phone: string;
    @ApiProperty({ default: "Can Tho" })
    @Expose()
    @IsString()
    address: string;
    @ApiProperty()
    @IsEnum(UserStatusEnum)
    @Expose()
    status: UserStatusEnum
    @ApiProperty()
    @IsEnum(RoleEnum)
    @Expose()
    role: RoleEnum
}