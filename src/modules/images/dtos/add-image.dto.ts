import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, Validate } from 'class-validator';
import { IsValidString } from 'src/common/decorators/string-validation.decorator';

export class AddImageDto {
  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @Validate(IsValidString)
  name: string;

  @ApiProperty({ default: '' })
  @Expose()
  @IsString()
  @Validate(IsValidString)
  dir: string;
}
