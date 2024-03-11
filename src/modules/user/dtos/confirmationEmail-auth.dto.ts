import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmationEmailDto {

    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    token: string;
}