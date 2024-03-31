import { Module } from "@nestjs/common";
import { ToolRegistrationController } from "./tool_registration.controller";
import { ToolRegistrationService } from "./tool_registration.service";

@Module({
    controllers: [ToolRegistrationController],
    providers: [ToolRegistrationService],
    exports: [ToolRegistrationService]
})

export class ToolRegistrationModule { }