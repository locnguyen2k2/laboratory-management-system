import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/common/dtos/base.dto";
import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import { IsDateGreaterThanOrEqualToday } from "src/common/decorators/date-validation.decorate";
import { ItemRegistration } from "../registration.constant";
import { RegistrationEntity } from "../registration.entity";

class BaseRegistrationDto extends BaseDto {
    @Expose()
    createBy: number;

    @Expose()
    updateBy: number;

    @Expose()
    user: number;

    @ApiProperty({ default: "YY-MM-DD" })
    @Expose()
    @IsDateString({}, { each: true })
    @IsNotEmpty()
    @IsDateGreaterThanOrEqualToday()
    start_day: string;

    @ApiProperty({ default: "YY-MM-DD" })
    @Expose()
    @IsDateString({}, { each: true })
    @IsNotEmpty()
    @IsDateGreaterThanOrEqualToday()
    end_day: string;
}

export class AddRegistrationDto extends BaseRegistrationDto {

    @ApiProperty({ default: [{ itemId: null, quantity: 1 }] })
    @Expose()
    @IsNotEmpty()
    items: ItemRegistration[];
}

export class AddItemRegistrationDto extends BaseRegistrationDto {

    @Expose()
    itemId: number;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @Expose()
    @IsNumber()
    registration: RegistrationEntity;
}
