import { Module } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { MailModule } from "../email/mail.module";
import { RoleModule } from "../role/role.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), MailModule, RoleModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})

export class UserModule { }