import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/dtos/base.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ItemRegistration } from './../../registration/registration.constant';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';
import { ItemRegistrationStatus } from '../item-registration.constant';

export class UpdateItemRegistrationDto extends BaseDto {
  @ApiProperty({ default: 0, description: 'Empty if this not changes!' })
  @Expose()
  @IsOptional()
  @IsNumber()
  end_day?: number;

  @ApiProperty({
    default: {
      roomItemId: null,
      quantity: 1,
      status: ItemRegistrationStatus.PENDING,
      itemStatus: ItemStatusEnum.STILLINGOODUSE,
    },
  })
  @Expose()
  @IsNotEmpty()
  items: ItemRegistration;
}
