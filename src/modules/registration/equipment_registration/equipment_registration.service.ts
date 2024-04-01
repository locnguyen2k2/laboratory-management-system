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
            .getMany()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)

    }

    async addEquipmentReg(item: any, quantity: number, registration: any, user: number) {
        const equipmentReg = await this.findByRegistrationId(registration.id)
        let isReplace = false;
        equipmentReg.map(async (equipment) => {
            if (item.id === equipment.equipment.id) {
                isReplace = true;
                equipment.quantity += quantity;
                await this.equipmentRegRepo.createQueryBuilder()
                    .update(EquipmentRegistrationEntity)
                    .set({
                        quantity: equipment.quantity
                    })
                    .where('id = :id', { id: equipment.id })
                    .execute();
                return;
            }
        })
        if (isReplace === false) {
            const newItem = new EquipmentRegistrationEntity({ equipment: item, quantity: quantity, registration: registration, createBy: user, updateBy: user });
            await this.equipmentRegRepo.save(newItem);
            return;
        }
    }
}