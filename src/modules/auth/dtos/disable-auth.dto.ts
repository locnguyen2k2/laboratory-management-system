import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "./../../../globals/base.dto";
import { UserStatusEnum } from "../enums/user-status.enum";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";

export class DisableDto extends BaseDto {

    @ApiProperty({ default: "" })
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @ApiProperty({ default: "" })
    @Expose()
    @IsEnum(UserStatusEnum)
    @IsNotEmpty()
    status: UserStatusEnum;
}