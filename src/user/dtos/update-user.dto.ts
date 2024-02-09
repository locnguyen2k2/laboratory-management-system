import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsPhoneNumber, IsString } from "class-validator";
import { BaseDto } from "src/globals/base.dto";

export class UpdateUserDto extends BaseDto {

    @ApiProperty({})
    @Expose()
    @IsString()
    firstName: string;
    @ApiProperty({})
    @Expose()
    @IsString()
    lastName: string;
    @ApiProperty({})
    @Expose()
    @IsPhoneNumber('VN')
    phone: string;
    @ApiProperty({ default: "Can Tho" })
    @Expose()
    @IsString()
    address: string;
}