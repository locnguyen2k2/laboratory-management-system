import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, Validate, IsEnum } from "class-validator";
import { IsValidString } from "src/common/decorators/string-validation.decorator";
import { RoomStatus } from "./../room.constant";
import { BaseDto } from "src/common/dtos/base.dto";

export class UpdateRoomDto extends BaseDto {
    @Expose()
    updateBy: number;

    @ApiProperty({ default: "" })
    @Expose()
    @IsString()
    @Validate(IsValidString)
    name: string;
    
    @ApiProperty({ default: null })
    @Expose()
    @IsEnum(RoomStatus)
    status: RoomStatus;

    @ApiProperty({ default: "" })
    @Expose()
    remark?: string;

}