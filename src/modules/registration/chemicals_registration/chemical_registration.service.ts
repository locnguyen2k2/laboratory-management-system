import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChemicalRegistrationEntity } from "./chemical_registration.entity";
import { Repository } from "typeorm";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";

@Injectable()
export class ChemicalRegistrationService {
    constructor(
        @InjectRepository(ChemicalRegistrationEntity) private readonly chemicalRegRepo: Repository<ChemicalRegistrationEntity>,
    ) { }

    async findByRegistrationId(regid: number) {
        const registration = await this.chemicalRegRepo.createQueryBuilder('item')
            .where('item.registration_id = :registrationId', { registrationId: regid })
            .leftJoinAndSelect('item.chemical', 'chemical')
            .select(['item.id', 'item.quantity', 'chemical.id', 'chemical.name', 'chemical.quantity'])
            .getMany()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)

    }

    async addChemicalReg(chemical: any, quantity: number, registration: any, user: number) {
        const listChemicalReg = await this.findByRegistrationId(registration.id)
        let isReplace = false;
        listChemicalReg.map(async (chemicalReg) => {
            if (chemical.id === chemicalReg.chemical.id) {
                isReplace = true;
                chemicalReg.quantity += quantity;
                await this.chemicalRegRepo.createQueryBuilder()
                    .update(ChemicalRegistrationEntity)
                    .set({
                        quantity: chemicalReg.quantity
                    })
                    .where('id = :id', { id: chemicalReg.id })
                    .execute();
                return;
            }
        })
        if (isReplace === false) {
            const newItem = new ChemicalRegistrationEntity({ chemical: chemical, quantity: quantity, registration: registration, createBy: user, updateBy: user });
            await this.chemicalRegRepo.save(newItem);
            return;
        }
    }
}