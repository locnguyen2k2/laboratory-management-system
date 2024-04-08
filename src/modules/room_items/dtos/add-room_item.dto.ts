import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, Length } from "class-validator";
import { BaseDto } from "src/common/dtos/base.dto";

export class AddRoomItemDto extends BaseDto {
    @ApiProperty({ default: '' })
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    roomId: number
    @ApiProperty({ default: '' })
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    itemId: number;
    @ApiProperty({ default: '' })
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    handover_statusId: number;
    @ApiProperty({ default: '' })
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
    @ApiProperty({ default: '' })
    @Expose()
    @IsNotEmpty()
    @Length(4)
    year: string;

    @Expose()
    createBy: number;
    @Expose()
    updateBy: number;
}