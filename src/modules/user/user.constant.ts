import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { RoleEnum } from '../../enums/role-enum.enum';
import { Transform } from 'class-transformer';

export enum UserStatus {
  ACTIVE = 0,
  UNACTIVE = 1,
  DISABLE = 2,
}

export class UserFilterDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: UserStatus,
    isArray: true,
  })
  @IsEnum(UserStatus, { each: true })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((status) => parseInt(status, 10))
      : value.split(',').map((status) => parseInt(status, 10)),
  )
  readonly status?: UserStatus[];

  @ApiPropertyOptional({
    enum: RoleEnum,
    isArray: true,
  })
  @IsEnum(RoleEnum, { each: true })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((role) => parseInt(role, 10))
      : value.split(',').map((role) => parseInt(role, 10)),
  )
  readonly role?: RoleEnum[];
}
