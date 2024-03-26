import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { UserRole, UserStatus } from "./../user.constant";

export class UpdateUserDto {

    @ApiProperty({ default: "" })
    @Validate(IsValidString)
    @IsNotEmpty()
    @IsString()
    @Expose()
    firstName: string;
    @ApiProperty({ default: "" })
    @Validate(IsValidString)
    @IsNotEmpty()
    @IsString()
    @Expose()
    lastName: string;
    @ApiProperty({ default: "" })
    @IsPhoneNumber('VN')
    @IsNotEmpty()
    @Expose()
    phone: string;
    @ApiProperty({ default: "" })
    @Validate(IsValidString)
    @IsNotEmpty()
    @IsString()
    @Expose()
    address: string;
    @ApiProperty({ default: null })
    @Validate(IsValidString)
    @IsString()
    @Expose()
    photo: string;
}

export class UpdateAdminDto extends UpdateUserDto {

    @ApiProperty({ default: "" })
    @IsEnum(UserStatus)
    @IsNotEmpty()
    @Expose()
    status: UserStatus
}

export class UpdatePermissionDto {
    @ApiProperty({ default: "" })
    @IsEnum(UserRole)
    @IsNotEmpty()
    @Expose()
    oldRid: UserRole;
    @ApiProperty({ default: "" })
    @IsEnum(UserRole)
    @IsNotEmpty()
    @Expose()
    newRid: UserRole;
}

export class UpdateStatusDto {
    @ApiProperty({ default: "" })
    @IsEnum(UserStatus)
    @IsNotEmpty()
    @Expose()
    status: UserStatus
}