import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ItemReturningService } from './item-returning.service';
import { ApiPaginatedRespone } from '../../common/decorators/api-paginated-respone.decorate';
import { JwtGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleEnum } from '../../enums/role-enum.enum';
import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { PageDto } from '../../common/dtos/page.dto';
import { ItemReturningDto } from './dtos/item-returning.dto';
import { AddItemReturningDto } from './dtos/add-item-returning.dto';

@ApiTags('Item Returning')
@ApiBearerAuth()
@Controller('item-returning')
export class ItemReturningController {
  constructor(private readonly itemReturningService: ItemReturningService) {}

  @Get()
  @ApiPaginatedRespone(ItemReturningDto)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ItemReturningDto>> {
    return await this.itemReturningService.findAll(pageOptionsDto);
  }

  @Post('')
  @UseGuards(JwtGuard)
  async createItemReturning(
    @Body() dto: AddItemReturningDto,
    @Request() req: any,
  ) {
    dto.createBy = dto.updateBy = req.user.id;
    const dateNow = new Date();
    dto.date_returning = dateNow.valueOf();
    const data = AddItemReturningDto.plainToClass(dto);
    return await this.itemReturningService.add(data);
  }
}
