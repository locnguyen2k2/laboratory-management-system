import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsPhoneNumber, IsString } from "class-validator";
import { BaseDto } from "src/globals/base.dto";

export class UpdateUserDto extends BaseDto {

    @ApiProperty({default: ""})
    @Expose()
    @IsString()
    firstName: string;
    @ApiProperty({default: ""})
    @Expose()
    @IsString()
    lastName: string;
    @ApiProperty({default: ""})
    @Expose()
    @IsPhoneNumber('VN')
    phone: string;
    @ApiProperty({ default: "Can Tho" })
    @Expose()
    @IsString()
    address: string;
}