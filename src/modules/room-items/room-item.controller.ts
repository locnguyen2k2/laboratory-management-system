import { Body, Controller, Post, Request, UseGuards, Get, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RoomItemService } from "./room-item.service";
import { AddListRoomItemDto, AddRoomItemDto } from "./dtos/add-roomItem.dto";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { RoleEnum } from "src/enums/role-enum.enum";
import { Roles } from "src/common/decorators/roles.decorator";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { UpdateRoomItemDto } from "./dtos/update-roomItem.dto";

@Controller('room-items')
@ApiTags('Room items')
@ApiBearerAuth()
export class RoomItemController {
    constructor(
        private readonly roomItemService: RoomItemService
    ) { }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
    async addRoomItem(@Body() dto: AddRoomItemDto, @Request() req: any) {
        dto.createBy = dto.updateBy = req.user.id
        const data = AddRoomItemDto.plainToClass(dto);
        return await this.roomItemService.addRoomItem(data);
    }

    @Post('add-list-room-items')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
    async addListRoomItem(@Body() dto: AddListRoomItemDto, @Request() req: any) {
        dto.createBy = dto.updateBy = req.user.id
        const data = AddListRoomItemDto.plainToClass(dto);
        return await this.roomItemService.addListRoomItem(data);
    }

    @Patch(':id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
    async updateRoomItem(@IdParam() id: number, @Body() dto: UpdateRoomItemDto, @Request() req: any) {
        dto.updateBy = req.user.id;
        const data = UpdateRoomItemDto.plainToClass(dto);
        return await this.roomItemService.updateRoomItem(id, data)
    }

    @Get('room/:id')
    async getRoomItem(@IdParam() id: number) {
        return await this.roomItemService.findByRoomId(id);
    }
}