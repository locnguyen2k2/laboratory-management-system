import { Body, Controller, Patch, Post, UseGuards, Get, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "./../user/user.constant";
import { AddItemDto } from "./dtos/add-item.dto";
import { ItemService } from "./item.service";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { UpdateItemDto } from "./dtos/update-item.dto";

@Controller('items')
@ApiTags('Items')
@ApiBearerAuth()
export class ItemController {
    constructor(
        private readonly itemService: ItemService
    ) { }

    @Get()
    async get() {
        return await this.itemService.findAll();
    }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async add(@Body() dto: AddItemDto, @Request() req: any) {
        const data = AddItemDto.plainToClass(dto);
        data.createBy = data.updateBy = req.user.id;
        return await this.itemService.add(data);
    }

    @Patch('/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async update(@IdParam() id: number, @Body() dto: UpdateItemDto, @Request() req: any) {
        const data = UpdateItemDto.plainToClass(dto);
        data.updateBy = req.user.id
        return await this.itemService.update(id, data);
    }

    @Get('/:id')
    async getEquipment(@IdParam() id: number) {
        return await this.itemService.findById(id);
    }

    @Get('category/:id')
    async getEquipmentByCategory(@IdParam() id: number) {
        return await this.itemService.findByCategory(id);
    }
}