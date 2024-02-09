import { Expose, Transform } from "class-transformer";
import { IsEnum} from "class-validator"
import { RoleEnum } from "src/auth/enums/role.enum";
import { RegisterUserDto } from "./register-user.dto";

export class RegisterManagerDto extends RegisterUserDto {

    @Expose()
    @IsEnum(RoleEnum)
    @Transform(() => RoleEnum.MANAGER)
    role: RoleEnum;
}