import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { DeviceStatusEnum } from "src/common/enums/device-status.enum";

export class UpdateDeviceDto {
    @ApiProperty({ default: "null" })
    @Expose()
    @IsString()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: null })
    @Expose()
    @IsNumber()
    @Min(0)
    quantity: number;

    @ApiProperty({ default: null })
    @Expose()
    @IsEnum(DeviceStatusEnum)
    status: number;

    @ApiProperty({ default: null })
    @Expose()
    categoryId: number;
}