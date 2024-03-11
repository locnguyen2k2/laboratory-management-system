import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { UserStatusEnum } from "../../../common/enums/user-status.enum";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";

export class DisableDto {

    @ApiProperty({ description: "Email is used to register" })
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @ApiProperty({ description: "0, 1 or 2" })
    @Expose()
    @IsEnum(UserStatusEnum)
    @IsNotEmpty()
    status: UserStatusEnum;
}