import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';
import { ItemRegistrationStatus } from '../item-registration/item-registration.constant';
import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export interface ItemRegistration {
  roomItemId?: number;
  quantity?: number;
  status?: ItemRegistrationStatus;
  itemStatus?: ItemStatusEnum;
}

export enum RegistrationStatusEnum {
  PENDING = 0,
  APPROVED = 1,
  CANCELED = 2,
  RETURNED = 3,
}

export enum UserBorrowedEnum {
  TEACHER = '@ctuet.edu.vn',
  STUDENT = '@student.ctuet.edu.vn',
}

export class RegistrationFilterDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: RegistrationStatusEnum,
    isArray: true,
  })
  @IsEnum(RegistrationStatusEnum, { each: true })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((status) => parseInt(status, 10))
      : value.split(',').map((status) => parseInt(status, 10)),
  )
  readonly status?: RegistrationStatusEnum[];

  @ApiPropertyOptional({
    enum: UserBorrowedEnum,
    isArray: true,
  })
  @IsOptional()
  @IsEnum(UserBorrowedEnum, { each: true })
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    } else if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    } else {
      return [value];
    }
  })
  readonly user?: UserBorrowedEnum[];
}
