import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { DeviceStatusEnum } from "src/common/enums/device-status.enum";

export class AddDeviceDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: null })
    @Expose()
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ default: null })
    @Expose()
    @IsNotEmpty()
    @IsEnum(DeviceStatusEnum)
    status: number;

    @ApiProperty({ nullable: false })
    @Expose()
    @IsNotEmpty()
    categoryId: number;
}