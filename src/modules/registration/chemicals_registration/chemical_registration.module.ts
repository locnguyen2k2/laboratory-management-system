import { Module } from "@nestjs/common";
import { ChemicalRegistrationController } from "./chemical_registration.controller";
import { ChemicalRegistrationService } from "./chemical_registration.service";

@Module({
    controllers: [ChemicalRegistrationController],
    providers: [ChemicalRegistrationService],
    exports: [ChemicalRegistrationService]
})

export class ChemicalRegistrationModule { }