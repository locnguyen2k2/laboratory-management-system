import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, Validate } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { UnitStatus } from "./../unit.constant";
import { BaseDto } from "src/common/dtos/base.dto";

export class AddUnitDto extends BaseDto {
    @ApiProperty({ default: '' })
    @IsString()
    @Expose()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: UnitStatus.ACTIVE })
    @IsEnum(UnitStatus)
    @Expose()
    status: number;
}