import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsEnum } from "class-validator";
import { RoleEnum } from "./../../auth/enums/role.enum";
import { UserStatusEnum } from "./../../auth/enums/user-status.enum";
import { UpdateUserDto } from "./update-user.dto";

export class UpdateAdminDto extends UpdateUserDto {

    @ApiProperty({ default: "" })
    @Expose()
    @IsEnum(UserStatusEnum)
    status: UserStatusEnum
    @ApiProperty({ default: "" })
    @Expose()
    @IsEnum(RoleEnum)
    role: RoleEnum
}