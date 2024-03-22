import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "./../../user/user.constant";
import { UserService } from "./../../user/user.service";
import { ROLES_KEY } from "./../../../common/decorators/roles.decorator";
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RoleService } from "src/modules/system/role/role.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly roleService: RoleService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!(requiredRoles)) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new HttpException("Token is required!", HttpStatus.UNAUTHORIZED);
        }
        const payload = await this.jwtService.decode(token);
        if (payload?.id) {
            const roles = await this.roleService.getRoleByUserId(payload.id);
            if (requiredRoles.some(role => roles.includes(role))) {
                request['user'] = payload;
                return true
            }
            throw new HttpException("Permission denied!", HttpStatus.BAD_REQUEST)
        }
        throw new HttpException("Token is invalid", HttpStatus.BAD_REQUEST)
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === "Bearer" ? token : undefined;
    }
}   