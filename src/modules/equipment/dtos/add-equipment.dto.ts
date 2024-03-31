import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { EquipmentStatusEnum } from "./../equipment-status.enum";
import { CategoryEnum } from "src/modules/categories/category-enum";

export class AddEquipmentDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: 1 })
    @Expose()
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ default: EquipmentStatusEnum.AVAILABLE })
    @Expose()
    @IsNotEmpty()
    @IsEnum(EquipmentStatusEnum)
    status: number;

    @ApiProperty({ default: null })
    @Expose()
    remark: string;

    @Expose()
    createBy: number;

    @Expose()
    updateBy: number;

    @Transform(() => CategoryEnum.EQUIPMENT)
    categoryId: number;
}