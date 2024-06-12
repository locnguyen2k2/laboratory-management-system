import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  createBy: number;
  @ApiProperty()
  updateBy: number;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  photo: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  status: number;
  @ApiProperty()
  role: number;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updatedAt: string;
}
