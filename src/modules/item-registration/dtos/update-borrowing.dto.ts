import { Expose, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/common/dtos/base.dto";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { ItemRegistration, RegistrationStatusEnum } from "./../../registration/registration.constant";
import { IsDateGreaterThanOrEqualToday } from "src/common/decorators/date-validation.decorate";
import { ItemStatusEnum } from "src/enums/item-status-enum.enum";

export class UpdateItemRegistrationDto extends BaseDto {
    @ApiProperty({ default: 0, description: 'Empty if this not changes!' })
    @Expose()
    @IsNumber()
    end_day: number;

    @ApiProperty({ default: { itemId: null, quantity: 1, roomId: null, status: ItemStatusEnum.STILLINGOODUSE } })
    @Expose()
    @IsNotEmpty()
    items: ItemRegistration;

}