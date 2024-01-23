import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { UserStatusEnum } from "src/auth/enums/user-status.enum";
import { BaseDto } from "src/globals/base.dto";

export class UpdateUserDto extends BaseDto {

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
}