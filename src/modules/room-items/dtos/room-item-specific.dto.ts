import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { ItemDto } from "src/modules/items/dtos/item.dto";

class RoomItem {
    @ApiProperty()
    id: number;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
    @ApiProperty()
    createBy: number;
    @ApiProperty()
    updateBy: number;
    @ApiProperty()
    status: number;
    @ApiProperty()
    quantity: number;
    @ApiProperty()
    year: string;
    @ApiProperty()
    remark: string;
    @ApiProperty()
    @Type(() => ItemDto)
    item: ItemDto
}

export class RoomItemSpecificDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => RoomItem)
    roomItem: RoomItem[]
}