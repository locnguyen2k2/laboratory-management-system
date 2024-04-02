import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EquipmentRegistrationEntity } from "./equipment_registration.entity";
import { Repository } from "typeorm";
import { AddEquipmentRegDto } from "./dtos/add-equipment-registration.dto";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";

@Injectable()
export class EquipmentRegistrationService {
    constructor(
        @InjectRepository(EquipmentRegistrationEntity) private readonly equipmentRegRepo: Repository<EquipmentRegistrationEntity>
    ) { }

    async findByRegistrationId(regid: number) {
        const registration = await this.equipmentRegRepo.createQueryBuilder('item')
            .where('item.registration_id = :registrationId', { registrationId: regid })
            .leftJoinAndSelect('item.equipment', 'equipment')
            .select(['item.id', 'item.quantity', 'equipment.id', 'equipment.name', 'equipment.quantity'])
            .getMany()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)

    }

    async addEquipmentReg(equipment: any, quantity: number, registration: any, user: number) {
        const listEquipmentReg = await this.findByRegistrationId(registration.id)
        let isReplace = false;
        listEquipmentReg.map(async (equipmentReg) => {
            if (equipment.id === equipmentReg.equipment.id) {
                isReplace = true;
                equipmentReg.quantity += quantity;
                await this.equipmentRegRepo.createQueryBuilder()
                    .update(EquipmentRegistrationEntity)
                    .set({
                        quantity: equipmentReg.quantity
                    })
                    .where('id = :id', { id: equipmentReg.id })
                    .execute();
                return;
            }
        })
        if (isReplace === false) {
            const newItem = new EquipmentRegistrationEntity({ equipment: equipment, quantity: quantity, registration: registration, createBy: user, updateBy: user });
            await this.equipmentRegRepo.save(newItem);
            return;
        }
    }
}