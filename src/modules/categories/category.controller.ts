import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtGuard } from './../auth/guard/jwt-auth.guard';
import { RoleEnum } from 'src/enums/role-enum.enum';
import { Roles } from './../../common/decorators/roles.decorator';
import { RolesGuard } from './../auth/guard/roles-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddCategoryDto } from './dtos/add-category.dto';
import { IdParam } from 'src/common/decorators/id-param.decorator';
import { UpdateDto } from './dtos/update.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { CategoryDto } from './dtos/category.dto';
import { CategoryEntity } from './category.entity';
import { ApiPaginatedRespone } from 'src/common/decorators/api-paginated-respone.decorate';

@Controller('categories')
@ApiTags('Categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiPaginatedRespone(CategoryDto)
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CategoryDto>> {
    return await this.categoryService.findAll(pageOptionsDto);
  }

  @Get('/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async getById(@IdParam() id: number) {
    return await this.categoryService.findById(id);
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async add(@Body() dto: AddCategoryDto) {
    const data = AddCategoryDto.plainToClass(dto);
    return await this.categoryService.add(data);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async delete(@IdParam() id: number) {
    return await this.categoryService.deleteById(id);
  }

  @Patch('/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async update(@IdParam() id: number, @Body() dto: UpdateDto) {
    const data = UpdateDto.plainToClass(dto);
    return await this.categoryService.update(id, data);
  }
}
