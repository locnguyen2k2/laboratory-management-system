import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsString, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { CategoryStatusEnum } from "src/common/enums/category-status.enum";

export class AddCategoryDto {
    @ApiProperty({ default: '' })
    @IsString()
    @Expose()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: CategoryStatusEnum.ACTIVE })
    @Expose()
    @Transform(({ value }) => CategoryStatusEnum.ACTIVE)
    status: number;
}