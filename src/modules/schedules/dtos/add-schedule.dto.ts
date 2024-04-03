import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { BaseDto } from "src/common/dtos/base.dto";

export class AddScheduleDto extends BaseDto {

    @ApiProperty({ default: 'hh:mm:ss' })
    @Expose()
    @IsNotEmpty()
    start: string;
    
    @ApiProperty({ default: 'hh:mm:ss' })
    @Expose()
    @IsNotEmpty()
    end: string;
}