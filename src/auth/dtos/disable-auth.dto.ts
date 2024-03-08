import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { UserStatusEnum } from "../enums/user-status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/globals/base.dto";

export class DisableDto extends BaseDto {

    @ApiProperty({default: ""})
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @ApiProperty({default: ""})
    @IsEnum(UserStatusEnum)
    @IsNotEmpty()
    status: UserStatusEnum;
}