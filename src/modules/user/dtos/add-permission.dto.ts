import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { UserRole } from "../user.constant";

export class AddPermissionDto {
    @ApiProperty({ default: "" })
    @IsNumber()
    @Expose()
    @IsNotEmpty()
    uid: number;
    @ApiProperty({ default: "" })
    @Expose()
    @IsNotEmpty()
    @IsEnum(UserRole)
    rid: UserRole;
}