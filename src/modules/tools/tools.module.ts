import { Module } from "@nestjs/common";
import { ToolsController } from "./tools.controller";
import { ToolsService } from "./tools.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ToolsEntity } from "./tools.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ToolsEntity])],
    controllers: [ToolsController],
    providers: [ToolsService],
    exports: [ToolsService],
})

export class ToolsModule { }