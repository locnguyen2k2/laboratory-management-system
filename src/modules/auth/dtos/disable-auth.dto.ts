import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { UserStatus } from "./../../user/user.constant";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";

export class DisableDto {

    @ApiProperty({ description: "Email is used to register" })
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @ApiProperty({ description: "0, 1 or 2" })
    @Expose()
    @IsEnum(UserStatus)
    @IsNotEmpty()
    status: UserStatus;
}