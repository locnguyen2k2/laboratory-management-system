import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "./../user/user.module";
import { MailModule } from "./../email/mail.module";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { SessionSerializer } from "./utils/Serializer";
import { LocalStrategy } from "./strategy/local.strategy";
import { RoleModule } from "../system/role/role.module";


@Module({
    imports: [UserModule, MailModule, HttpModule, RoleModule],
    controllers: [AuthController],
    providers: [AuthService, SessionSerializer, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})

export class AuthModule { }