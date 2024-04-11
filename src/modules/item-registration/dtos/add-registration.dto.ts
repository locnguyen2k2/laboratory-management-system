import { Expose, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/common/dtos/base.dto";
import { IsDateString, IsEnum, IsNotEmpty } from "class-validator";
import { ItemRegistration, RegistrationStatusEnum } from "./../../registration/registration.constant";
import { IsDateGreaterThanOrEqualToday } from "src/common/decorators/date-validation.decorate";
import { ItemStatusEnum } from "src/enums/item-status-enum.enum";

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

    @ApiProperty({ default: [{ itemId: null, quantity: 1, roomId: null, status: ItemStatusEnum.STILLINGOODUSE }] })
    @Expose()
    @IsNotEmpty()
    items: ItemRegistration[];

}