import { PassportSerializer } from "@nestjs/passport";
import { UserService } from "src/user/user.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly authService: UserService) { super() }
    serializeUser(user: any, done: Function) {
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
        return payload?.email ? done(null, payload) : done(null, null)
    }
}