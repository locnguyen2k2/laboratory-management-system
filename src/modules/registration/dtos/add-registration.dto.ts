import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsDate, IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import { IsDateGreaterThanOrEqualToday } from "src/common/decorators/date-validation.decorate";
import { ItemRegistration } from "../registration.constant";

export class AddRegistrationDto {
    @Expose()
    createBy: number;
    @Expose()
    updateBy: number;
    @ApiProperty({ default: null })
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    user: number;

    @ApiProperty({ default: "YY-MM-DD" })
    @Expose()
    @IsDateString({}, { each: true })
    @IsNotEmpty()
    @IsDateGreaterThanOrEqualToday()
    from: string;

    @ApiProperty({ default: "YY-MM-DD" })
    @Expose()
    @IsDateString({}, { each: true })
    @IsNotEmpty()
    @IsDateGreaterThanOrEqualToday()
    to: string;

    @ApiProperty({ default: [{ itemId: null, quantity: null, categoryId: null }] })
    @Expose()
    @IsNotEmpty()
    items: ItemRegistration[];
}
