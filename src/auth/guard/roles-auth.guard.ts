import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleEnum } from "src/auth/enums/role.enum";
import { ROLES_KEY } from "../decorator/roles.decorator";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UserService } from "src/user/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
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
            const user = await this.userService.findByEmail(payload.email);
            if (requiredRoles.includes(user.role)) {
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