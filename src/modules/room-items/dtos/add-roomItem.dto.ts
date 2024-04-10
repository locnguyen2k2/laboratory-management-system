import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, Length } from "class-validator";
import { BaseDto } from "src/common/dtos/base.dto";
import { ItemStatusEnum } from "src/enums/item-status-enum.enum";

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

    @ApiProperty({ default: ItemStatusEnum.NORMALOPERATION })
    @Expose()
    @IsNotEmpty()
    @IsEnum(ItemStatusEnum)
    status: ItemStatusEnum;

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