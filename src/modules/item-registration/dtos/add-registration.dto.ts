import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/common/dtos/base.dto";
import { IsDateString, IsNotEmpty } from "class-validator";
import { ItemRegistration } from "./../../registration/registration.constant";
import { IsDateGreaterThanOrEqualToday } from "src/common/decorators/date-validation.decorate";

export class AddItemRegistrationDto extends BaseDto {
    @Expose()
    createBy: number;
    @Expose()
    updateBy: number;
    @Expose()
    user: number;

    @ApiProperty({ default: "2024-MM-DD" })
    @Expose()
    @IsDateString({}, { each: true })
    @IsNotEmpty()
    @IsDateGreaterThanOrEqualToday()
    start_day: string;

    @ApiProperty({ default: "2024-MM-DD" })
    @Expose()
    @IsDateString({}, { each: true })
    @IsNotEmpty()
    @IsDateGreaterThanOrEqualToday()
    end_day: string;

    @ApiProperty({ default: [{ itemId: null, quantity: 1, roomId: null }] })
    @Expose()
    @IsNotEmpty()
    items: ItemRegistration[];

}