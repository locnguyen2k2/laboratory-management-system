import { Body, Controller, Get, Patch, Post, UseGuards, Request, Query } from "@nestjs/common";
import { RoomService } from "./room.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtGuard } from "../auth/guard/jwt-auth.guard";
import { RolesGuard } from "../auth/guard/roles-auth.guard";
import { RoleEnum } from "src/enums/role-enum.enum";
import { AddRoomDto } from "./dtos/add-room.dto";
import { UpdateRoomDto } from "./dtos/update-room.dto";
import { RoomDto } from "./dtos/room.dto";
import { ApiPaginatedRespone } from "src/common/decorators/api-paginated-respone.decorate";
import { PageOptionsDto } from "src/common/dtos/page-options.dto";
import { PageDto } from "src/common/dtos/page.dto";
import { CategoryDto } from "../categories/dtos/category.dto";

@Controller('rooms')
@ApiTags('Rooms')
@ApiBearerAuth()
export class RoomController {
    constructor(
        private readonly roomService: RoomService
    ) { }

    @Get()
    @ApiPaginatedRespone(CategoryDto)
    async get(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<RoomDto>> {
        return await this.roomService.findAll(pageOptionsDto);
    }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
    async add(@Body() dto: AddRoomDto, @Request() req: any) {
        const data = AddRoomDto.plainToClass(dto);
        data.createBy = data.updateBy = req.user.id
        return await this.roomService.add(data);
    }

    @Patch('/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
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