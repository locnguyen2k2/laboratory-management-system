import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "./../../user/user.constant";
import { UserService } from "./../../user/user.service";
import { ROLES_KEY } from "./../../../common/decorators/roles.decorator";
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RoleService } from "src/modules/system/role/role.service";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly jwtService: JwtService,
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
            throw new BusinessException(ErrorEnum.TOKEN_IS_REQUIRE);
        }
        const payload = await this.jwtService.decode(token);
        if (payload?.id) {
            const roles = await this.roleService.getRoleByUserId(payload.id);
            if (requiredRoles.some(role => roles.includes(role))) {
                request['user'] = payload;
                return true
            }
            throw new BusinessException(ErrorEnum.NO_PERMISSION)
        }
        throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN)
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === "Bearer" ? token : undefined;
    }
}   