import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/common/dtos/base.dto";
import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import { IsDateGreaterThanOrEqualToday } from "src/common/decorators/date-validation.decorate";
import { ItemRegistration, RoomRegistration } from "../registration.constant";
import { RegistrationEntity } from "../registration.entity";

class BaseRegistrationDto extends BaseDto {
    @Expose()
    createBy: number;

    @Expose()
    updateBy: number;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
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

    @ApiProperty({ default: [{ itemId: null, quantity: null, categoryId: null }] })
    @Expose()
    @IsNotEmpty()
    items: ItemRegistration[];
}

export class AddRoomRegistrationDto extends BaseRegistrationDto {

    @ApiProperty({ default: [{ itemId: null, schedules: [] }] })
    @Expose()
    @IsNotEmpty()
    items: RoomRegistration[];
}

export class AddRoomItemRegistrationDto extends BaseRegistrationDto {
    @Expose()
    @IsNotEmpty()
    itemId: number;

    @Expose()
    @IsNotEmpty()
    schedules: number[];

    @Expose()
    registration: RegistrationEntity;
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
