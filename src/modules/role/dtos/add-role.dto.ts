import { IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { RoleStatus } from "../role.constant";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { BaseDto } from "src/common/dtos/base.dto";

export class AddRoleDto extends BaseDto {
    @IsString()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;
    @IsNumber()
    @IsNotEmpty()
    value: string;
    @IsNotEmpty()
    status: RoleStatus;
}