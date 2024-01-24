import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { GoogleStrategy } from "./strategy/google.strategy";
import { SessionSerializer } from "./utils/Serializer";


@Module({
    imports: [UserModule,],
    controllers: [AuthController],
    providers: [AuthService, SessionSerializer, LocalStrategy, JwtStrategy, GoogleStrategy],
    exports: [AuthService],
})

export class AuthModule { }