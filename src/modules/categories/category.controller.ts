import { Body, Controller, Post, UseGuards, Patch, Get } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { JwtGuard } from "./../auth/guard/jwt-auth.guard";
import { UserRole } from "./../user/user.constant";
import { Roles } from "./../../common/decorators/roles.decorator";
import { RolesGuard } from "./../auth/guard/roles-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AddCategoryDto } from "./dtos/add-category.dto";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { UpdateDto } from "./dtos/update.dto";

@Controller('categories')
@ApiTags('Categories')
@ApiBearerAuth()
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) { }

    @Get()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async getAll() {
        return await this.categoryService.findAll();
    }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async add(@Body() dto: AddCategoryDto) {
        const data = AddCategoryDto.plainToClass(dto)
        return await this.categoryService.add(data);
    }

    @Patch("/:id")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async update(@IdParam() id: number, @Body() dto: UpdateDto) {
        const data = UpdateDto.plainToClass(dto)
        return await this.categoryService.update(id, data);
    }

}