import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { SessionSerializer } from "./utils/Serializer";
import { EmailModule } from "src/email/email.module";
import { HttpModule } from "@nestjs/axios";


@Module({
    imports: [UserModule, EmailModule, HttpModule],
    controllers: [AuthController],
    providers: [AuthService, SessionSerializer, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})

export class AuthModule { }