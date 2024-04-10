import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsPhoneNumber, IsString, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { UserStatus } from "./../user.constant";
import { BaseDto } from "src/common/dtos/base.dto";
import { RoleEnum } from "src/enums/role-enum.enum";

export class UpdateUserDto extends BaseDto {

    @ApiProperty({ default: "" })
    @Validate(IsValidString)
    @IsString()
    @Expose()
    firstName: string;
    @ApiProperty({ default: "" })
    @Validate(IsValidString)
    @IsString()
    @Expose()
    lastName: string;
    @ApiProperty({ default: "" })
    @Validate(IsValidString)
    @IsString()
    @Expose()
    address: string;
    @ApiProperty({ default: "" })
    @Validate(IsValidString)
    @IsString()
    @Expose()
    photo: string;
}

export class UpdateAdminDto extends UpdateUserDto {

    @ApiProperty({ default: "" })
    @IsEnum(UserStatus)
    @Expose()
    status: UserStatus

    @ApiProperty({ default: "" })
    @IsEnum(RoleEnum)
    @Expose()
    role: RoleEnum;
}