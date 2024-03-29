import { UserService } from "./user.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UpdatePermissionDto, UpdateStatusDto, UpdateUserDto } from "./dtos/update.dto";
import { UpdateAdminDto } from "./dtos/update.dto";
import { UserRole, UserStatus } from "./user.constant";
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
import { plainToClass } from "class-transformer";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('get')
    async findAll(): Promise<UserEntity[]> {
        return await this.userService.findAll();
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('get/:id')
    async findById(@IdParam() id: number): Promise<UserEntity> {
        return this.userService.findById(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Put('update')
    async updateAccountInfo(@Request() req: any,
        @Body() dto: UpdateUserDto): Promise<AccountInfo> {
        return await this.userService.updateAccountInfo(req.user.id, dto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put('update/:id')
    async update(@IdParam() id: number,
        @Body() dto: UpdateAdminDto): Promise<UserEntity> {
        return await this.userService.update(id, dto);
    }


    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch('status/:id')
    async updateStatus(@IdParam() id: number,
        @Body() dto: UpdateStatusDto): Promise<UserEntity> {
        const data = plainToClass(UpdateStatusDto, dto, { excludeExtraneousValues: true });
        return await this.userService.updateStatus(id, data.status);
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get('info')
    async info(@Request() req: any): Promise<AccountInfo> {
        return await this.userService.getAccountInfo(req.user.email)
    }

    @ApiBearerAuth()
    @Patch('email/resent-confirm-links')
    async resendConfirmationLink(@Body() dto: EmailLinkConfirmDto) {
        return await this.userService.resendConfirmationLink(dto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post('permission')
    async addPermission(@Body() dto: AddPermissionDto) {
        const data = plainToClass(AddPermissionDto, dto, { excludeExtraneousValues: true })
        return await this.userService.addPermission(data);
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch('permision/:id')
    async updatePermission(@IdParam() uid: number,
        @Body() dto: UpdatePermissionDto): Promise<UserEntity> {
        return await this.userService.updateUserPermission(uid, dto);
    }

    @Get('email/confirm')
    async confirmRegister(@Query() dto: ConfirmationEmailDto) {
        return await this.userService.userConfirmation(dto);
    }

    @ApiBearerAuth()
    @Post('forget-password')
    async resetPassword(@Body() data: ResetPaswordDto): Promise<any> {
        return await this.userService.resetPassword(data.email);
    }

    @ApiBearerAuth()
    @Patch('update-password')
    async updatePassword(@Body() dto: ForgotPasswordDto) {
        return await this.userService.confirmRePassword(dto)
    }
}  