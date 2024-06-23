import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../../../common/dtos/base.dto';

export class RequestAuthDto {
  @ApiProperty({ default: '' })
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  id: number;
  @ApiProperty({ default: '' })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;
}

export class ReqReTokenDto extends BaseDto {
  @ApiProperty({ default: '' })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @ApiProperty({ default: '' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  refreshToken: string;
}
