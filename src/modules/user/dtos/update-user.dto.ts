import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { BaseDto } from "./../../../globals/base.dto";

export class UpdateUserDto extends BaseDto {

    @ApiProperty({ default: "" })
    @Expose()
    @IsNotEmpty()
    @IsString()
    firstName: string;
    @ApiProperty({ default: "" })
    @Expose()
    @IsNotEmpty()
    @IsString()
    lastName: string;
    @ApiProperty({ default: "" })
    @Expose()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;
    @ApiProperty({ default: "" })
    @Expose()
    @IsNotEmpty()
    @IsString()
    address: string;
    @ApiProperty({ default: null })
    @Expose()
    @IsString()
    photo: string;
}