import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { UserStatus } from "./../user.constant";

export class UpdateUserDto {

    @ApiProperty({ default: "" })
    @Expose()
    @IsNotEmpty()
    @IsString()
    @Validate(IsValidString)
    firstName: string;
    @ApiProperty({ default: "" })
    @Expose()
    @IsNotEmpty()
    @IsString()
    @Validate(IsValidString)
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
    @Validate(IsValidString)
    address: string;
    @ApiProperty({ default: null })
    @Expose()
    @IsString()
    photo: string;
}

export class UpdateAdminDto extends UpdateUserDto {

    @ApiProperty({ default: "" })
    @Expose()
    @IsEnum(UserStatus)
    status: UserStatus
}

export class UpdatePermissionDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    oldRid: number;
    @ApiProperty({ default: "" })
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    newRid: number;
}

export class UpdateStatusDto {
    @IsNotEmpty()
    @Expose()
    @IsEnum(UserStatus)
    status: UserStatus
}