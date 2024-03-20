import { Module } from "@nestjs/common";
import { ChemicalsController } from "./chemicals.controller";
import { ChemicalsService } from "./chemicals.service";

@Module({
    imports: [],
    controllers: [ChemicalsController],
    providers: [ChemicalsService],
    exports: [ChemicalsService],
})
export class ChemicalsModule { }