import { ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
    async canActivate(context: ExecutionContext) {
        try {
            const activate = (await super.canActivate(context)) as boolean;
            const request = context.switchToHttp().getRequest();
            await super.logIn(request);
            return activate;
        } catch {
            throw new HttpException("Your accesse is inavlid", HttpStatus.UNAUTHORIZED)
        }
    }
}