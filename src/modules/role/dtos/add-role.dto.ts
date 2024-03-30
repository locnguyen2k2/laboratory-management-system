import { IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { RoleStatus } from "../role.constant";
import { IsValidString } from "src/common/decorators/string-validation.decorator";

export class AddRoleDto {
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