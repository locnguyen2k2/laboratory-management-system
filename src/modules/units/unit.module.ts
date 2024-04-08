import { Module } from "@nestjs/common";
import { UnitController } from "./unit.controller";
import { UnitService } from "./unit.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UnitEntity } from "./unit.entity";
import { UserModule } from "../user/user.module";
import { RoleModule } from "../role/role.module";

@Module({
    imports: [TypeOrmModule.forFeature([UnitEntity]), UserModule, RoleModule],
    controllers: [UnitController],
    providers: [UnitService],
    exports: [UnitService]
})

export class UnitModule { }