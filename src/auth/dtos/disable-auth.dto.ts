import { IsEmail, IsEnum } from "class-validator";
import { UserStatusEnum } from "../enums/user-status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class DisableDto {

    @ApiProperty({default: ""})
    @IsEmail()
    email: string;
    @ApiProperty({default: ""})
    @IsEnum(UserStatusEnum)
    status: UserStatusEnum;
}