import { ApiProperty } from "@nestjs/swagger";
import { Expose} from "class-transformer";
import { IsEmail, IsEnum} from "class-validator";
import { RoleEnum } from "src/auth/enums/role.enum";
import { UserStatusEnum } from "src/auth/enums/user-status.enum";
import { UpdateUserDto } from "./update-user.dto";

export class UpdateAdminDto extends UpdateUserDto {

    @ApiProperty({})
    @Expose()
    @IsEmail()
    email: string;
    @ApiProperty()
    @IsEnum(UserStatusEnum)
    @Expose()
    status: UserStatusEnum
    @ApiProperty()
    @IsEnum(RoleEnum)
    @Expose()
    role: RoleEnum
}