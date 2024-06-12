import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserPasswordDto } from 'src/modules/user/dtos/password.dto';

export class LoginAuthDto extends UserPasswordDto {
  @ApiProperty({ default: '' })
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
