import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class AddRegistrationDto {
    createBy: number;
    updateBy: number;
    @ApiProperty({ default: null })
    @Expose()
    user: number;
    @ApiProperty({ default: "2024-01-30" })
    @Expose()
    from: Date;
    @ApiProperty({ default: "2024-01-30" })
    @Expose()
    to: Date;
    @ApiProperty({ default: [{ itemId: null, quantity: null, categoryId: null }] })
    @Expose()
    items: {
        categoryId: number,
        itemId: number,
        quantity: number
    }[];
}