import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemRegistrationEntity } from "./item_registration.entity";
import { Repository } from "typeorm";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { AddItemRegistrationDto } from "../dtos/add-registration.dto";
import { ItemService } from "src/modules/items/item.service";

@Injectable()
export class ItemRegistrationService {
    constructor(
        @InjectRepository(ItemRegistrationEntity) private readonly itemRegistrationRepository: Repository<ItemRegistrationEntity>,
        private readonly itemService: ItemService
    ) { }

    async findByRegistrationId(regid: number) {
        const registration = await this.itemRegistrationRepository.createQueryBuilder('registration')
            .where('registration.registration_id = :registrationId', { registrationId: regid })
            .leftJoinAndSelect('registration.item', 'item')
            .select(['registration.start_day', 'registration.end_day', 'registration.id', 'registration.quantity', 'item.id', 'item.name', 'item.quantity'])
            .getMany()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)

    }

    async findByUserDayItem(uid: number, startDay: string, endDay: string, id: number) {
        const registration = await this.itemRegistrationRepository.createQueryBuilder('registration')
            .leftJoinAndSelect('registration.item', 'item')
            .where('(registration.start_day >= :startDay AND registration.start_day <= :endDay AND item.id = :id && registration.createBy = :uid)', { startDay, endDay, id, uid })
            .orWhere('(registration.end_day >= :startDay AND registration.end_day <= :endDay AND item.id = :id && registration.createBy = :uid)', { startDay, endDay, id, uid })
            .select(['registration.start_day', 'registration.quantity', 'registration.end_day', 'registration.id', 'item.id', 'item.name'])
            .getOne()
        if (registration)
            return registration
    }

    async addItemReg(data: AddItemRegistrationDto) {
        let isReplace = false;
        const itemRegistration = await this.findByUserDayItem(data.createBy, data.start_day, data.end_day, data.itemId)
        if (itemRegistration) {
            if (data.end_day >= itemRegistration.end_day) {
                isReplace = true;
                data.quantity += itemRegistration.quantity
                await this.itemRegistrationRepository.update({ id: itemRegistration.id }, {
                    updatedAt: data.registration.createdAt,
                    end_day: data.end_day,
                    quantity: data.quantity
                })
                return;
            }
        }
        if (!isReplace) {
            const item = await this.itemService.findById(data.itemId)
            delete data.itemId;
            delete data.user;
            const newItem = new ItemRegistrationEntity({ ...data, item });
            await this.itemRegistrationRepository.save(newItem);
            return;
        }
    }
}