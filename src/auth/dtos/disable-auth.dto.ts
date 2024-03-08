import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { UserStatusEnum } from "../enums/user-status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/globals/base.dto";
import { Expose } from "class-transformer";

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