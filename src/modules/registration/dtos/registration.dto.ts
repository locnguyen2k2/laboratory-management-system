import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class RegistrationDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  createBy: number;
  @ApiProperty()
  updateBy: number;
  @ApiProperty()
  status: number;
  @ApiProperty()
  @IsObject()
  user: {
    id: number;
  };
}
