import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailLinkConfirmDto {
  @ApiProperty({ default: '' })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;
}

export class EmailFeedBackDto {
  @ApiProperty({ default: '' })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  from: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  @Expose()
  content: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  @Expose()
  key: string;
}
