import { Body, Controller, Post, UseGuards, Patch, Get } from "@nestjs/common";
import { ItemStatusService } from "./item-status.service";
import { JwtGuard } from "./../auth/guard/jwt-auth.guard";
import { UserRole } from "./../user/user.constant";
import { Roles } from "./../../common/decorators/roles.decorator";
import { RolesGuard } from "./../auth/guard/roles-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AddItemStatusDto } from "./dtos/add-itemStatus.dto";
import { UpdateItemStatusDto } from "./dtos/update-itemStatus.dto";
import { IdParam } from "src/common/decorators/id-param.decorator";

@Controller('item-status')
@ApiBearerAuth()
@ApiTags('Item Status')
export class ItemStatusController {
    constructor(
        private readonly itemStatusService: ItemStatusService,
    ) { }

    @Get()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async getAll() {
        return await this.itemStatusService.findAll();
    }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async add(@Body() dto: AddItemStatusDto) {
        const data = AddItemStatusDto.plainToClass(dto)
        return await this.itemStatusService.add(data);
    }

    @Patch("/:id")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async update(@IdParam() id: number, @Body() dto: UpdateItemStatusDto) {
        const data = UpdateItemStatusDto.plainToClass(dto)
        return await this.itemStatusService.update(id, data);
    }

}