import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { CategoryStatusEnum } from "src/common/enums/category-status.enum";

export class UpdateDto {
    @ApiProperty({ default: '' })
    @IsString()
    @Expose()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: null })
    @Expose()
    @IsNotEmpty()
    @IsEnum(CategoryStatusEnum)
    status: number;
}