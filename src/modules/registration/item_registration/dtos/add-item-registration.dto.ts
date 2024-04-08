import { Expose } from "class-transformer";
import { IsDateString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateGreaterThanOrEqualToday } from "src/common/decorators/date-validation.decorate";

export class AddEquipmentRegDto {
    @Expose()
    createBy: number

    @Expose()
    updateBy: number

    @Expose()
    quantity: number

    @ApiProperty({ default: "YY-MM-DD" })
    @Expose()
    @IsDateString({}, { each: true })
    @IsNotEmpty()
    @IsDateGreaterThanOrEqualToday()
    from: Date;

    @ApiProperty({ default: "YY-MM-DD" })
    @Expose()
    @IsDateString({}, { each: true })
    @IsNotEmpty()
    @IsDateGreaterThanOrEqualToday()
    to: Date;
}