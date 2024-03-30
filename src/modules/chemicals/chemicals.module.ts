import { Module } from "@nestjs/common";
import { ChemicalsController } from "./chemicals.controller";
import { ChemicalsService } from "./chemicals.service";
import { ChemicalsEntity } from "./chemicals.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleModule } from "../role/role.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([ChemicalsEntity]), UserModule, RoleModule],
    controllers: [ChemicalsController],
    providers: [ChemicalsService],
    exports: [ChemicalsService],
})
export class ChemicalsModule { }