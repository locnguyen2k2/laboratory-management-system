import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { BaseDto } from "src/globals/base.dto";

export class PasswordUpdateDto extends BaseDto {
    @ApiProperty({ description: 'Old password' })
    @IsString()
    @Matches(/^[a-z0-9A-Z\W_]+$/)
    @MinLength(6)
    @MaxLength(20)
    oldPassword: string

    @ApiProperty({ description: 'New password' })
    @Matches(/^S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, {
        message: "Password must contain numbers and letters and be 6-16 in length"
    })
    newPassword: string
}

export class UserPasswordDto extends BaseDto {

    @ApiProperty({ description: 'Password' })
    @Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, { message: 'Password format is incorrect', })
    @IsNotEmpty()
    @Expose()
    password: string
}