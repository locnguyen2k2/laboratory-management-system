import { Body, Controller, Post, Request, UseGuards, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RoomItemService } from "./room-item.service";
import { AddRoomItemDto } from "./dtos/add-roomItem.dto";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { UserRole } from "../user/user.constant";
import { Roles } from "src/common/decorators/roles.decorator";
import { IdParam } from "src/common/decorators/id-param.decorator";

@Controller('room-items')
@ApiTags('Room items')
@ApiBearerAuth()
export class RoomItemController {
    constructor(
        private readonly roomItemService: RoomItemService
    ) { }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async addRoomItem(@Body() dto: AddRoomItemDto, @Request() req: any) {
        dto.createBy = dto.updateBy = req.user.id
        const data = AddRoomItemDto.plainToClass(dto);
        return await this.roomItemService.addRoomItem(data);
    }

    @Get('room/:id')
    async getRoomItem(@IdParam() id: number) {
        return await this.roomItemService.findByRoomId(id);
    }
}