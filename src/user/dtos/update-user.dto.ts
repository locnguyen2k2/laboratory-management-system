import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { UserStatusEnum } from "src/auth/enums/user-status.enum";
import { BaseDto } from "src/globals/base.dto";

export class UpdateUserDto extends BaseDto {

    @ApiProperty({})
    @Expose()
    @IsString()
    firstName: string;
    @ApiProperty({})
    @Expose()
    @IsString()
    lastName: string;
    @ApiProperty({})
    @Expose()
    @IsPhoneNumber('VN')
    phone: string;
    @ApiProperty({ default: "Can Tho" })
    @Expose()
    @IsString()
    address: string;
}