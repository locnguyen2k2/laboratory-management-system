import { ApiProperty } from "@nestjs/swagger";

export class RoomDto {
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
    name: string;
    @ApiProperty()
    remark: string;
    @ApiProperty()
    status: number;
}