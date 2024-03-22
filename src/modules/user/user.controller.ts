import { UserService } from "./user.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UpdatePermissionDto, UpdateUserDto } from "./dtos/update.dto";
import { UpdateAdminDto } from "./dtos/update.dto";
import { DisableDto } from "../auth/dtos/disable-auth.dto";
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
import { UserStatus } from "./user.constant";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @ApiBearerAuth()
    @Get('get')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async findAll(): Promise<any> {
        return await this.userService.findAll();
    }

    @ApiBearerAuth()
    @Get('get/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async findById(@IdParam() id: number): Promise<any> {
        return this.userService.findById(id);
    }

    @ApiBearerAuth()
    @Put('update')
    @UseGuards(JwtGuard)
    async updateAccountInfo(@Body() dto: UpdateUserDto, @Request() req: any): Promise<any> {
        return await this.userService.updateAccountInfo(req.user.email, dto);
    }

    @ApiBearerAuth()
    @Put('update/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async update(
        @IdParam() id: number,
        @Body() dto: UpdateAdminDto,
        @Request() req: any): Promise<any> {
        return await this.userService.update(id, dto, req.user.email);
    }

    @ApiBearerAuth()
    @Get('info')
    @UseGuards(JwtGuard)
    async info(@Request() req: any): Promise<any> {
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
    @Patch('permision/:id')
    async updatePermission(@IdParam() uid: number, @Body() dto: UpdatePermissionDto) {
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

    @ApiBearerAuth()
    @Patch('status/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateStatus(@IdParam() id: number, @Body() data: DisableDto) {
        return await this.userService.updateStatus(id, data.status);
    }

    @ApiBearerAuth()
    @Patch('disable')
    @UseGuards(JwtGuard)
    async disable(@Request() req: any) {
        const user = await this.userService.findByEmail(req.user.email)
        const unactive = await this.userService.updateStatus(user.id, UserStatus.DISABLE);
        if (unactive) {
            return "Your account is disabled";
        }

    }
}  