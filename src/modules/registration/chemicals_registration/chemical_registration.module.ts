import { Module } from "@nestjs/common";
import { ChemicalRegistrationController } from "./chemical_registration.controller";
import { ChemicalRegistrationService } from "./chemical_registration.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChemicalRegistrationEntity } from "./chemical_registration.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ChemicalRegistrationEntity])],
    controllers: [ChemicalRegistrationController],
    providers: [ChemicalRegistrationService],
    exports: [ChemicalRegistrationService] 
})

export class ChemicalRegistrationModule { }