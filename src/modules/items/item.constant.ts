import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ItemStatusEnum } from 'src/enums/item-status-enum.enum';

export enum ItemStatus {
  AVAILABLE = 0,
  UNAVAILABLE = 1,
  DISABLE = 2,
}

export class ItemFilterDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: ItemStatusEnum,
    isArray: true,
  })
  @IsEnum(ItemStatusEnum, { each: true })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((status) => parseInt(status, 10))
      : value.split(',').map((status) => parseInt(status, 10)),
  )
  readonly status?: ItemStatus[];

  @ApiPropertyOptional({
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    } else if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    } else {
      return [value];
    }
  })
  readonly producer?: string[];
}
