import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { RoleEnum } from 'src/enums/role-enum.enum';
import { BaseDto } from 'src/common/dtos/base.dto';

export class UpdatePermissionDto extends BaseDto {
  @ApiProperty({ default: '' })
  @IsNumber()
  @Expose()
  @IsNotEmpty()
  uid: number;
  @ApiProperty({ default: '' })
  @Expose()
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  rid: RoleEnum;
}
