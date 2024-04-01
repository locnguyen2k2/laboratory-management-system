import { Module } from "@nestjs/common";
import { ToolRegistrationController } from "./tool_registration.controller";
import { ToolRegistrationService } from "./tool_registration.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ToolRegistrationEntity } from "./tool_registration.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ToolRegistrationEntity])],
    controllers: [ToolRegistrationController],
    providers: [ToolRegistrationService],
    exports: [ToolRegistrationService]
})

export class ToolRegistrationModule { }