import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EquipmentRegistrationEntity } from "./equipment_registration.entity";
import { Repository } from "typeorm";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { AddItemRegistrationDto } from "../dtos/add-registration.dto";
import { EquipmentService } from "src/modules/equipment/equipment.service";

@Injectable()
export class EquipmentRegistrationService {
    constructor(
        @InjectRepository(EquipmentRegistrationEntity) private readonly equipmentRegRepo: Repository<EquipmentRegistrationEntity>,
        private readonly equipmentService: EquipmentService
    ) { }

    async findByRegistrationId(regid: number) {
        const registration = await this.equipmentRegRepo.createQueryBuilder('item')
            .where('item.registration_id = :registrationId', { registrationId: regid })
            .leftJoinAndSelect('item.equipment', 'equipment')
            .select(['item.start_day', 'item.end_day', 'item.id', 'item.quantity', 'equipment.id', 'equipment.name', 'equipment.quantity'])
            .getMany()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)

    }

    async addEquipmentReg(data: AddItemRegistrationDto) {
        let isReplace = false;
        const listEquipmentReg = await this.findByRegistrationId(data.registration.id)
        const equipment = await this.equipmentService.findById(data.itemId)
        listEquipmentReg?.map(async (equipmentReg) => {
            if (data.itemId === equipmentReg.equipment.id) {
                isReplace = true;
                data.quantity += equipmentReg.quantity;
                await this.equipmentRegRepo.createQueryBuilder()
                    .update(EquipmentRegistrationEntity)
                    .set({
                        quantity: data.quantity
                    })
                    .where('id = :id', { id: equipmentReg.id })
                    .execute();
                return;
            }
        })

        if (!isReplace) {
            delete data.itemId;
            delete data.user;
            const newItem = new EquipmentRegistrationEntity({ ...data, equipment });
            await this.equipmentRegRepo.save(newItem);
            return;
        }
    }
}