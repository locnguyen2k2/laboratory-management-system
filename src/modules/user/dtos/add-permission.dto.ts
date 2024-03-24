import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AddPermissionDto {
    @ApiProperty({ default: "" })
    @IsNumber()
    @Expose()
    @IsNotEmpty()
    uid: number;
    @ApiProperty({ default: "" })
    @IsNumber()
    @Expose()
    @IsNotEmpty()
    rid: number;
}