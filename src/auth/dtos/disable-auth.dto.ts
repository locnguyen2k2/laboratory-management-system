import { IsEmail, IsEnum } from "class-validator";
import { UserStatusEnum } from "../enums/user-status.enum";

export class DisableDto {
    @IsEmail()
    email: string;
    @IsEnum(UserStatusEnum)
    status: UserStatusEnum;
}