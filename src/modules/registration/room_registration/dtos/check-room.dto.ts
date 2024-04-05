import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import { IsDateGreaterThanOrEqualToday } from "src/common/decorators/date-validation.decorate";
import { BaseDto } from "src/common/dtos/base.dto";

export class CheckRoomDto extends BaseDto {
    @ApiProperty({ default: "YY-MM-DD" })
    @Expose()
    @IsDateString({}, { each: true })
    @IsNotEmpty()
    @IsDateGreaterThanOrEqualToday()
    start_day: string;

    @ApiProperty({ default: "YY-MM-DD" })
    @Expose()
    @IsDateString({}, { each: true })
    @IsNotEmpty()
    @IsDateGreaterThanOrEqualToday()
    end_day: string;

    @ApiProperty({ default: null })
    @IsNotEmpty()
    @IsNumber()
    @Expose()
    roomid: number;
}