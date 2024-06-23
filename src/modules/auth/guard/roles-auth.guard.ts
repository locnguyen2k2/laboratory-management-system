import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from 'src/enums/role-enum.enum';
import { ROLES_KEY } from './../../../common/decorators/roles.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new BusinessException(ErrorEnum.TOKEN_IS_REQUIRE);
    }
    const payload = await this.jwtService.decode(token);
    if (payload?.id) {
      const user = await this.userService.findById(payload.id);
      if (requiredRoles.some((role) => role === user.role)) {
        request['user'] = payload;
        return true;
      }
      throw new BusinessException(ErrorEnum.NO_PERMISSION);
    }
    throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_TOKEN);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
