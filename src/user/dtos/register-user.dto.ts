import { ApiProperty } from "@nestjs/swagger";
import { Expose} from "class-transformer";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator"
import { BaseDto } from "src/globals/base.dto";

export class RegisterUserDto extends BaseDto {

    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    @Expose()
    firstName: string;

    @ApiProperty({})
    @IsString()
    @IsNotEmpty()
    @Expose()
    lastName: string;

    @ApiProperty({})
    @IsEmail()
    @IsNotEmpty()
    @Expose()
    email: string;

    @ApiProperty({})
    @IsPhoneNumber('VN')
    @IsNotEmpty()
    @Expose()
    phone: string;

    @ApiProperty({ default: "Tra Vinh" })
    @IsString()
    @IsNotEmpty()
    @Expose()
    address: string;

    @ApiProperty({ default: "" })
    @IsString()
    @Length(8, 32)
    @IsNotEmpty()
    @Expose()
    password: string;

    @ApiProperty({ default: "" })
    @IsString()
    @Length(8, 32)
    @IsNotEmpty()
    @Expose()
    confirmPassword: string;

}