import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { RoomStatus } from "./../room.constant";
import { BaseDto } from "src/common/dtos/base.dto";
import { IsString, IsNotEmpty, Validate, IsEnum } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";

export class AddRoomDto extends BaseDto {
    @Expose()
    createBy: number;
    @Expose()
    updateBy: number;

    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Validate(IsValidString)
    name: string;

    @ApiProperty({ default: "", nullable: true })
    @Expose()
    remark?: string;

    @ApiProperty({ default: RoomStatus.AVAILABLE })
    @Expose()
    @IsNotEmpty()
    @IsEnum(RoomStatus)
    status: number;
}