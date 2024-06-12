import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailLinkConfirmDto {
  @ApiProperty({ default: '' })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;
}
