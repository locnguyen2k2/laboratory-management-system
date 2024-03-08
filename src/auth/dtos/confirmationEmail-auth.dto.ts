import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "src/globals/base.dto";

export class ConfirmationEmailDto extends BaseDto {

    @ApiProperty({default: ""})
    @IsString()
    @IsNotEmpty()
    token: string;
}