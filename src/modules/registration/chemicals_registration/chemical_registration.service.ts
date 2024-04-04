import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChemicalRegistrationEntity } from "./chemical_registration.entity";
import { Repository } from "typeorm";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { AddItemRegistrationDto } from "../dtos/add-registration.dto";
import { ChemicalsService } from "src/modules/chemicals/chemicals.service";

@Injectable()
export class ChemicalRegistrationService {
    constructor(
        @InjectRepository(ChemicalRegistrationEntity) private readonly chemicalRegRepo: Repository<ChemicalRegistrationEntity>,
        private readonly chemicalService: ChemicalsService
    ) { }

    async findByRegistrationId(regid: number) {
        const registration = await this.chemicalRegRepo.createQueryBuilder('item')
            .where('item.registration_id = :registrationId', { registrationId: regid })
            .leftJoinAndSelect('item.chemical', 'chemical')
            .select(['item.start_day', 'item.end_day', 'item.id', 'item.quantity', 'chemical.id', 'chemical.name', 'chemical.quantity'])
            .getMany()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)

    }

    async addChemicalReg(data: AddItemRegistrationDto) {
        let isReplace = false;
        const listChemicalReg = await this.findByRegistrationId(data.registration.id)
        const chemical = await this.chemicalService.findById(data.itemId)
        listChemicalReg?.map(async (chemicalReg) => {
            if (data.itemId === chemicalReg.chemical.id) {
                isReplace = true;
                data.quantity += chemicalReg.quantity;
                await this.chemicalRegRepo.createQueryBuilder()
                    .update(ChemicalRegistrationEntity)
                    .set({
                        quantity: data.quantity
                    })
                    .where('id = :id', { id: chemicalReg.id })
                    .execute();
                return;
            }
        })

        if (!isReplace) {
            delete data.itemId;
            delete data.user;
            const newItem = new ChemicalRegistrationEntity({ ...data, chemical });
            await this.chemicalRegRepo.save(newItem);
            return;
        }
    }
}