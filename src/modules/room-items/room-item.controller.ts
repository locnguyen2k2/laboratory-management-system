import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoomItemService } from './room-item.service';
import { AddListRoomItemDto, AddRoomItemDto } from './dtos/add-roomItem.dto';
import { JwtGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles-auth.guard';
import { RoleEnum } from 'src/enums/role-enum.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IdParam } from 'src/common/decorators/id-param.decorator';
import { UpdateRoomItemDto } from './dtos/update-roomItem.dto';
import { ApiPaginatedRespone } from 'src/common/decorators/api-paginated-respone.decorate';
import { RoomItemDto } from './dtos/room-item.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { MailService } from '../email/mail.service';
import { CategoryEnum } from '../categories/category.constant';

@Controller('room-items')
@ApiTags('Room items')
@ApiBearerAuth()
export class RoomItemController {
  constructor(
    private readonly roomItemService: RoomItemService,
    private readonly mailService: MailService,
  ) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async addRoomItem(@Body() dto: AddRoomItemDto, @Request() req: any) {
    dto.createBy = dto.updateBy = req.user.id;
    const data = AddRoomItemDto.plainToClass(dto);
    return await this.roomItemService.addRoomItem(data);
  }

  @Post('add-list-room-items')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async addListRoomItem(@Body() dto: AddListRoomItemDto, @Request() req: any) {
    dto.createBy = dto.updateBy = req.user.id;
    const data = AddListRoomItemDto.plainToClass(dto);
    return await this.roomItemService.addListRoomItem(data);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async updateRoomItem(
    @IdParam() id: number,
    @Body() dto: UpdateRoomItemDto,
    @Request() req: any,
  ) {
    dto.updateBy = req.user.id;
    const data = UpdateRoomItemDto.plainToClass(dto);
    return await this.roomItemService.updateRoomItem(id, data);
  }

  @Get('room/:id')
  @ApiPaginatedRespone(RoomItemDto)
  async getItemsInRoom(
    @IdParam() id: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RoomItemDto>> {
    return await this.roomItemService.findByRoomId(id, pageOptionsDto);
  }

  @Get(':id')
  async getRoomItems(@IdParam() id: number) {
    return await this.roomItemService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async delete(@IdParam() id: number) {
    return await this.roomItemService.deleteById(id);
  }

  @Get('')
  @UseGuards(JwtGuard)
  @ApiPaginatedRespone(RoomItemDto)
  async getAllRoomItems(
    @Request() req: any,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RoomItemDto>> {
    return (await this.mailService.isTeacherCtutEmail(req.user.email)) ||
      req.user.role === RoleEnum.ADMIN
      ? await this.roomItemService.findAll(pageOptionsDto)
      : await this.roomItemService.findItemsForStudent(pageOptionsDto);
  }

  @Get('category/:id')
  @ApiPaginatedRespone(RoomItemDto)
  @UseGuards(JwtGuard)
  async getRoomItemsByCategory(
    @Request() req: any,
    @IdParam() id: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RoomItemDto> | { data: [] }> {
    return (id == CategoryEnum.CHEMICALS &&
      (await this.mailService.isTeacherCtutEmail(req.user.email))) ||
      id !== CategoryEnum.CHEMICALS ||
      req.user.role === RoleEnum.ADMIN
      ? await this.roomItemService.findByCategory(id, pageOptionsDto)
      : { data: [] };
  }

  @Get('item/:id')
  @ApiPaginatedRespone(RoomItemDto)
  async getRoomItemsByItem(
    @IdParam() id: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RoomItemDto>> {
    return await this.roomItemService.getRoomItemByItemId(id, pageOptionsDto);
  }
}
