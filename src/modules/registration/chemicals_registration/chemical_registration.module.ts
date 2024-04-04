import { Module } from "@nestjs/common";
import { ChemicalRegistrationController } from "./chemical_registration.controller";
import { ChemicalRegistrationService } from "./chemical_registration.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChemicalRegistrationEntity } from "./chemical_registration.entity";
import { ChemicalsModule } from "src/modules/chemicals/chemicals.module";

@Module({
    imports: [TypeOrmModule.forFeature([ChemicalRegistrationEntity]), ChemicalsModule],
    controllers: [ChemicalRegistrationController],
    providers: [ChemicalRegistrationService],
    exports: [ChemicalRegistrationService] 
})

export class ChemicalRegistrationModule { }