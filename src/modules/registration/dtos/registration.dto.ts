import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsObject, Min } from 'class-validator';
import { RegistrationStatusEnum } from '../registration.constant';
import { BaseDto } from '../../../common/dtos/base.dto';
import { Expose } from "class-transformer";

export class RegistrationDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  createBy: number;
  @ApiProperty()
  updateBy: number;
  @ApiProperty()
  status: number;
  @ApiProperty()
  @IsObject()
  user: {
    id: number;
    email?: string;
    createBy?: number;
    updateBy?: number;
    firstName?: string;
    lastName?: string;
    address?: string;
    photo?: string;
    status?: number;
    role?: number;
  };
}

export class UpdateRegStatusDto extends BaseDto {
  @Expose()
  updateBy: number;

  @ApiProperty({ default: null })
  @IsEnum(RegistrationStatusEnum)
  @Expose()
  status: RegistrationStatusEnum;
}
