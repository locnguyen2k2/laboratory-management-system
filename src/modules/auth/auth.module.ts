import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "./../user/user.module";
import { EmailModule } from "./../email/email.module";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { SessionSerializer } from "./utils/Serializer";
import { LocalStrategy } from "./strategy/local.strategy";


@Module({
    imports: [UserModule, EmailModule, HttpModule],
    controllers: [AuthController],
    providers: [AuthService, SessionSerializer, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})

export class AuthModule { }