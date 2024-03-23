import { Body, Controller, Post, UseGuards, Patch, Delete, Get } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { JwtGuard } from "./../auth/guard/jwt-auth.guard";
import { UserRole } from "./../user/user.constant";
import { Roles } from "./../../common/decorators/roles.decorator";
import { RolesGuard } from "./../auth/guard/roles-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AddCategoryDto } from "./dtos/add-category.dto";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { UpdateDto } from "./dtos/update.dto";

@Controller('categories')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) { }

    @ApiBearerAuth()
    @Get()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async getAll() {
        return await this.categoryService.findAll();
    }

    @ApiBearerAuth()
    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async add(@Body() dto: AddCategoryDto) {
        return await this.categoryService.add(dto);
    }

    @ApiBearerAuth()
    @Patch("/:id")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async update(@IdParam() id: number, @Body() dto: UpdateDto) {
        return await this.categoryService.update(id, dto);
    }

    // @ApiBearerAuth()
    // @Delete("/:id")
    // @UseGuards(JwtGuard, RolesGuard)
    // @Roles(UserRole.ADMIN)
    // async delete(@IdParam() id: number) {
    //     return await this.categoryService.delete(id);
    // }
}