import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  Get,
  Request,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/enums/role-enum.enum';
import { AddItemDto, AddListItemDto } from './dtos/add-item.dto';
import { ItemService } from './item.service';
import { IdParam } from 'src/common/decorators/id-param.decorator';
import { UpdateItemDto } from './dtos/update-item.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { ApiPaginatedRespone } from 'src/common/decorators/api-paginated-respone.decorate';
import { PageDto } from 'src/common/dtos/page.dto';
import { ItemDto } from './dtos/item.dto';

@Controller('items')
@ApiTags('Items')
@ApiBearerAuth()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  @ApiPaginatedRespone(ItemDto)
  async get(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ItemDto>> {
    return await this.itemService.findAll(pageOptionsDto);
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async add(@Body() dto: AddItemDto, @Request() req: any) {
    const data = AddItemDto.plainToClass(dto);
    data.createBy = data.updateBy = req.user.id;
    return await this.itemService.add(data);
  }

  @Post('/add-list-item')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async addList(@Body() dto: AddListItemDto, @Request() req: any) {
    const data = AddListItemDto.plainToClass(dto);
    data.createBy = data.updateBy = req.user.id;
    return await this.itemService.addListItem(data);
  }

  @Patch('/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async update(
    @IdParam() id: number,
    @Body() dto: UpdateItemDto,
    @Request() req: any,
  ) {
    const data = UpdateItemDto.plainToClass(dto);
    data.updateBy = req.user.id;
    return await this.itemService.update(id, data);
  }

  @Get('/:id')
  async getEquipment(@IdParam() id: number) {
    return await this.itemService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async delete(@IdParam() id: number) {
    return await this.itemService.deleteById(id);
  }

  @Get('category/:id')
  @ApiPaginatedRespone(ItemDto)
  async getEquipmentByCategory(
    @IdParam() id: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ItemDto>> {
    return await this.itemService.findByCategory(id, pageOptionsDto);
  }
}
