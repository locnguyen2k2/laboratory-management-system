import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ConfigService } from "@nestjs/config";
import { UserModule } from "src/user/user.module";
import { EmailController } from "./email.controller";

@Module({
    imports: [UserModule],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService]
})

export class EmailModule { }