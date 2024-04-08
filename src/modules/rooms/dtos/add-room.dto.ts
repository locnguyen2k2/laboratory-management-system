import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsString, IsNotEmpty, Validate, IsNumber, Min, IsEnum, IsEmail } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { RoomStatus } from "./../room.constant";
import { CategoryEnum } from "src/modules/categories/category.constant";
import { BaseDto } from "src/common/dtos/base.dto";

export class AddRoomDto extends BaseDto {
    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: RoomStatus.AVAILABLE })
    @Expose()
    @IsNotEmpty()
    @IsEnum(RoomStatus)
    status: number;

    @Expose()
    createBy: number;
    @Expose()
    updateBy: number;

}