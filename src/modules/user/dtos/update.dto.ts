import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { RoleEnum } from "src/common/enums/role.enum";
import { UserStatusEnum } from "src/common/enums/user-status.enum";

export class UpdateUserDto {

    @ApiProperty({ default: "" })
    @Expose()
    @IsNotEmpty()
    @IsString()
    firstName: string;
    @ApiProperty({ default: "" })
    @Expose()
    @IsNotEmpty()
    @IsString()
    lastName: string;
    @ApiProperty({ default: "" })
    @Expose()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;
    @ApiProperty({ default: "" })
    @Expose()
    @IsNotEmpty()
    @IsString()
    address: string;
    @ApiProperty({ default: null })
    @Expose()
    @IsString()
    photo: string;
}

export class UpdateAdminDto extends UpdateUserDto {

    @ApiProperty({ default: "" })
    @Expose()
    @IsEnum(UserStatusEnum)
    status: UserStatusEnum
    @ApiProperty({ default: "" })
    @Expose()
    @IsEnum(RoleEnum)
    role: RoleEnum
}