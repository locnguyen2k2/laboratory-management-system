import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dtos/base.dto';

export class ConfirmationEmailDto extends BaseDto {
  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  token: string;
}
