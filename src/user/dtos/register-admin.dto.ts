import { Expose, Transform } from "class-transformer";
import { IsEnum} from "class-validator"
import { RoleEnum } from "src/auth/enums/role.enum";
import { RegisterUserDto } from "./register-user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterAdminDto extends RegisterUserDto {

    @ApiProperty({default: ""})
    @Expose()
    @IsEnum(RoleEnum)
    @Transform(() => RoleEnum.ADMIN)
    role: RoleEnum;
}