import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNumber, IsString, Min, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { EquipmentStatusEnum } from "./../equipment-status.enum";

export class UpdateEquipmentDto {
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
    @IsEnum(EquipmentStatusEnum)
    status: number;

    @ApiProperty({ default: null })
    @Expose()
    categoryId: number;
}