import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsValidString } from 'src/common/decorators/string-validation.decorator';

export class GoogleRedirectDto {
  @ApiProperty({ default: 'ctuet.edu.vn' })
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @Validate(IsValidString)
  firstName: string;
  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Validate(IsValidString)
  lastName: string;
  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @Validate(IsValidString)
  photo: string;
  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
