import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "src/auth/guard/jwt-auth.guard";
import { RolesGuard } from "src/auth/guard/roles-auth.guard";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Roles } from "src/auth/decorator/roles.decorator";
import { RoleEnum } from "src/auth/enums/role.enum";
import { UpdateAdminDto } from "./dtos/update-admin.dto";
import { JwtPayload } from "src/auth/interfaces/jwt.interface";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {

    }

    @UseGuards(JwtGuard)
    @Post('update')
    async update(@Body() user: UpdateUserDto, @Request() req: any): Promise<any> {
        return await this.userService.update(req.user.email, user);
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Post('update/admin')
    async updateAdmin(@Body() user: UpdateAdminDto, @Request() req: any): Promise<any> {
        return await this.userService.updateAdmin(req.user.email, user);
    }
}  