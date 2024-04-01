import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AddRegistrationDto {
    createBy: number;
    updateBy: number;
    @ApiProperty({ default: null })
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    user: number;
    @ApiProperty({ default: "2024-01-30" })
    @Expose()
    @IsNotEmpty()
    from: Date;
    @ApiProperty({ default: "2024-01-30" })
    @Expose()
    @IsNotEmpty()
    to: Date;
    @ApiProperty({ default: [{ itemId: null, quantity: null, categoryId: null }] })
    @Expose()
    @IsNotEmpty()
    items: {
        categoryId: number,
        itemId: number,
        quantity: number
    }[];
}