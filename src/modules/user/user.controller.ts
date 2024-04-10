import { UserService } from "./user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UpdatePermissionDto, UpdateStatusDto, UpdateUserDto } from "./dtos/update.dto";
import { UpdateAdminDto } from "./dtos/update.dto";
import { UserRole } from "./user.constant";
import { ResetPaswordDto } from "../auth/dtos/reset-password.dto";
import { IdParam } from "src/common/decorators/id-param.decorator";
import { JwtGuard } from "./../../modules/auth/guard/jwt-auth.guard";
import { EmailLinkConfirmDto } from "../email/dtos/email-confirm.dto";
import { Roles } from "./../../common/decorators/roles.decorator";
import { RolesGuard } from "./../../modules/auth/guard/roles-auth.guard";
import { ConfirmationEmailDto } from "./dtos/confirmationEmail-auth.dto";
import { Body, Controller, Request, UseGuards, Get, Put, Patch, Query, Post } from "@nestjs/common";
import { ForgotPasswordDto } from "./dtos/password.dto";
import { UserEntity } from "./user.entity";
import { AccountInfo } from "./interfaces/AccountInfo.interface";
import { AddPermissionDto } from "./dtos/add-permission.dto";

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get('get')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async findAll(): Promise<UserEntity[]> {
        return await this.userService.findAll();
    }

    @Get('get/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async findById(@IdParam() id: number): Promise<UserEntity> {
        return this.userService.findById(id);
    }

    @Put('update')
    @UseGuards(JwtGuard)
    async updateAccountInfo(@Request() req: any,
        @Body() dto: UpdateUserDto): Promise<AccountInfo> {
        const data = UpdateUserDto.plainToClass(dto);
        return await this.userService.updateAccountInfo(req.user.id, data);
    }

    @Put('update/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async update(@IdParam() id: number,
        @Body() dto: UpdateAdminDto): Promise<UserEntity> {
        const data = UpdateAdminDto.plainToClass(dto);
        return await this.userService.update(id, data);
    }


    @Patch('status/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async updateStatus(@IdParam() id: number,
        @Body() dto: UpdateStatusDto): Promise<UserEntity> {
        const data = UpdateStatusDto.plainToClass(dto);
        return await this.userService.updateStatus(id, data.status);
    }

    @Get('info')
    @UseGuards(JwtGuard)
    async info(@Request() req: any): Promise<AccountInfo> {
        return await this.userService.getAccountInfo(req.user.email)
    }

    @Patch('email/resent-confirm-links')
    async resendConfirmationLink(@Body() dto: EmailLinkConfirmDto) {
        return await this.userService.resendConfirmationLink(dto);
    }
    
    @Post('permission')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async addPermission(@Body() dto: AddPermissionDto) {
        const data = AddPermissionDto.plainToClass(dto);
        return await this.userService.addPermission(data);
    }

    @Patch('permision/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async updatePermission(@IdParam() uid: number,
        @Body() dto: UpdatePermissionDto): Promise<UserEntity> {
        const data = UpdatePermissionDto.plainToClass(dto);
        return await this.userService.updateUserPermission(uid, data);
    }

    @Get('email/confirm')
    async confirmRegister(@Query() dto: ConfirmationEmailDto) {
        const data = ConfirmationEmailDto.plainToClass(dto);
        return await this.userService.userConfirmation(data);
    }

    @Post('forget-password')
    async resetPassword(@Body() dto: ResetPaswordDto): Promise<any> {
        const data = ResetPaswordDto.plainToClass(dto);
        return await this.userService.resetPassword(data.email);
    }

    @Patch('update-password')
    async updatePassword(@Body() dto: ForgotPasswordDto) {
        const data = ForgotPasswordDto.plainToClass(dto);
        return await this.userService.confirmRePassword(data)
    }
}  