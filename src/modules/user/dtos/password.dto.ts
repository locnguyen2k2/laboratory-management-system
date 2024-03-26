import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";

export class PasswordUpdateDto {
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

export class UserPasswordDto {

    @ApiProperty({ description: 'Password' })
    @Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, { message: 'Password format is incorrect', })
    @IsNotEmpty()
    @Expose()
    password: string
}

export class ForgotPasswordDto extends UserPasswordDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Validate(IsValidString)
    digitalNumbs: string;

}