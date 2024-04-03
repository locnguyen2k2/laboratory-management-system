import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNumber, IsString, Min, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { EquipmentStatusEnum } from "./../equipment.constant";
import { BaseDto } from "src/common/dtos/base.dto";

export class UpdateEquipmentDto extends BaseDto {
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

    @ApiProperty({ default: EquipmentStatusEnum.AVAILABLE })
    @Expose()
    @IsEnum(EquipmentStatusEnum)
    status: number;

    @ApiProperty({ default: null })
    @Expose()
    updateBy: number;
}