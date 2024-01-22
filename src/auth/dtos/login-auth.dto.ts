import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginAuthDto {

    @ApiProperty({default: "locnguyentan1230@gmail.com"})
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({default: "07112002NTLoc"})
    @Expose()
    @IsString()
    @Length(8, 32)
    @IsNotEmpty()
    password: string;

}