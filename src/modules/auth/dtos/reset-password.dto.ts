import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";
import { BaseDto } from "src/common/dtos/base.dto";

export class ResetPaswordDto extends BaseDto {
    @ApiProperty({ default: "" })
    @IsEmail()
    @IsNotEmpty()
    @Expose()
    email: string;
}