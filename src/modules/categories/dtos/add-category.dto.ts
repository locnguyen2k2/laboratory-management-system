import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { CategoryStatusEnum } from "./../category.constant";
import { BaseDto } from "src/common/dtos/base.dto";

export class AddCategoryDto extends BaseDto {
    @ApiProperty({ default: '' })
    @IsString()
    @Expose()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: CategoryStatusEnum.ACTIVE })
    @IsEnum(CategoryStatusEnum)
    @Expose()
    status: number;
}