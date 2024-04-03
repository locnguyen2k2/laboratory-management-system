import { IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { RoleStatus } from "../role.constant";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { BaseDto } from "src/common/dtos/base.dto";
import { Expose } from "class-transformer";

export class AddRoleDto extends BaseDto {
    @IsString()
    @IsNotEmpty()
    @Validate(IsValidString)
    @Expose()
    name: string;
    @IsNumber()
    @IsNotEmpty()
    @Expose()
    value: string;
    @IsNotEmpty()
    @Expose()
    status: RoleStatus;
}