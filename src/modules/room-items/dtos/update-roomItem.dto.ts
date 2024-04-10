import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { BaseDto } from "src/common/dtos/base.dto"

export class UpdateRoomItemDto extends BaseDto {
    @ApiProperty({ default: null })
    @Expose()
    roomId: number
    @ApiProperty({ default: null })
    @Expose()
    itemId: number
    @ApiProperty({ default: null })
    @Expose()
    item_status: number
    @ApiProperty({ default: null })
    @Expose()
    quantity: number
    @ApiProperty({ default: '' })
    @Expose()
    year: string
    @ApiProperty({ default: '' })
    @Expose()
    remark: string

    @Expose()
    updateBy: number;
}