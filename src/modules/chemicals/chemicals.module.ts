import { Module } from "@nestjs/common";
import { ChemicalsController } from "./chemicals.controller";
import { ChemicalsService } from "./chemicals.service";
import { ChemicalsEntity } from "./chemicals.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleModule } from "../role/role.module";
import { UserModule } from "../user/user.module";
import { CategoryModule } from "../categories/category.module";

@Module({
    imports: [TypeOrmModule.forFeature([ChemicalsEntity]), UserModule, RoleModule, CategoryModule],
    controllers: [ChemicalsController],
    providers: [ChemicalsService],
    exports: [ChemicalsService],
})
export class ChemicalsModule { }