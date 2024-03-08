import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { BaseDto } from "src/globals/base.dto";

export class EmailLinkConfirmDto extends BaseDto {
    @ApiProperty({ default: "" })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}