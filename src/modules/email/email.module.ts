import { EmailService } from "./email.service";
import { Module } from "@nestjs/common";
import { EmailController } from "./email.controller";

@Module({
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService]
})

export class EmailModule { }