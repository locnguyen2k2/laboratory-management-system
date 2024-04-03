import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, IsNotEmpty, Validate, IsNumber, Min, IsEnum } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { RoomStatus } from "./../room.constant";
import { BaseDto } from "src/common/dtos/base.dto";

export class UpdateRoomDto extends BaseDto {
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
    updateBy: number;
}