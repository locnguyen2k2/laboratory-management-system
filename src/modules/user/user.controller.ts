import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateAdminDto, UpdateUserDto } from './dtos/update.dto';
import { RoleEnum } from 'src/enums/role-enum.enum';
import { ResetPaswordDto } from '../auth/dtos/reset-password.dto';
import { IdParam } from 'src/common/decorators/id-param.decorator';
import { JwtGuard } from './../../modules/auth/guard/jwt-auth.guard';
import { EmailLinkConfirmDto } from '../email/dtos/email-confirm.dto';
import { Roles } from './../../common/decorators/roles.decorator';
import { RolesGuard } from './../../modules/auth/guard/roles-auth.guard';
import { ConfirmationEmailDto } from './dtos/confirmationEmail-auth.dto';
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
import { ForgotPasswordDto, PasswordUpdateDto } from './dtos/password.dto';
import { UserEntity } from './user.entity';
import { AccountInfo } from './interfaces/AccountInfo.interface';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { ApiPaginatedRespone } from 'src/common/decorators/api-paginated-respone.decorate';
import { UserDto } from './dtos/user.dto';
import { UserFilterDto } from './user.constant';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  @ApiPaginatedRespone(UserDto)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async findAll(
    @Query() pageOptionsDto: UserFilterDto,
  ): Promise<PageDto<UserEntity>> {
    return await this.userService.findAll(pageOptionsDto);
  }

  @Get('get/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async findById(@IdParam() id: number): Promise<UserEntity> {
    return this.userService.findOne(id);
  }

  @Patch('update')
  @UseGuards(JwtGuard)
  async updateAccountInfo(
    @Request() req: any,
    @Body() dto: UpdateUserDto,
  ): Promise<AccountInfo> {
    const data = UpdateUserDto.plainToClass(dto);
    return await this.userService.updateAccountInfo(req.user.id, data);
  }

  @Patch('update/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async update(
    @IdParam() id: number,
    @Body() dto: UpdateAdminDto,
    @Request() req: any,
  ): Promise<UserEntity> {
    const data = UpdateAdminDto.plainToClass(dto);
    return await this.userService.update(id, data, req.user);
  }

  @Get('info')
  @UseGuards(JwtGuard)
  async info(@Request() req: any): Promise<AccountInfo> {
    return await this.userService.getAccountInfo(req.user.email);
  }

  @Patch('email/resent-confirm-links')
  async resendConfirmationLink(@Body() dto: EmailLinkConfirmDto) {
    return await this.userService.resendConfirmationLink(dto);
  }

  @Get('email/confirm')
  async confirmRegister(@Query() dto: ConfirmationEmailDto) {
    const data = ConfirmationEmailDto.plainToClass(dto);
    return await this.userService.userConfirmation(data);
  }

  @Post('forgot-password')
  async fogotPassword(@Body() dto: ResetPaswordDto): Promise<any> {
    const data = ResetPaswordDto.plainToClass(dto);
    return await this.userService.forgotPassword(data.email);
  }

  @Patch('update-password')
  async updatePassword(@Body() dto: ForgotPasswordDto) {
    const data = ForgotPasswordDto.plainToClass(dto);
    return await this.userService.confirmRePassword(data);
  }

  @Patch('reset-password')
  @UseGuards(JwtGuard)
  async resetPassword(@Body() dto: PasswordUpdateDto, @Request() req: any) {
    const data = PasswordUpdateDto.plainToClass(dto);
    return await this.userService.resetPassword(req.user.id, data);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async delete(@IdParam() id: number) {
    return await this.userService.deleteById(id);
  }
}
