import { Body, Controller, Get, Patch, Post, UseGuards, Request } from "@nestjs/common";
import { RoomService } from "./room.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { UserRole } from "../user/user.constant";
import { AddRoomDto } from "./dtos/add-room.dto";
import { UpdateRoomDto } from "./dtos/update-room.dto";

@Controller('rooms')
@ApiBearerAuth()
@ApiTags('Rooms')
export class RoomController {
    constructor(
        private readonly roomService: RoomService
    ) { }

    @Get()
    async get() {
        return await this.roomService.findAll();
    }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async add(@Body() dto: AddRoomDto, @Request() req: any) {
        const data = AddRoomDto.plainToClass(dto);
        data.createBy = data.updateBy = req.user.id
        return await this.roomService.add(data);
    }

    @Patch('/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async update(@IdParam() id: number, @Body() dto: UpdateRoomDto, @Request() req: any) {
        dto.updateBy = req.user.id;
        const data = UpdateRoomDto.plainToClass(dto);
        return await this.roomService.update(id, data);
    }

    @Get('/:id')
    async getEquipment(@IdParam() id: number) {
        return await this.roomService.findById(id);
    }
}