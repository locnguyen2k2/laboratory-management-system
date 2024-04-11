import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemRegistrationEntity } from "./item-registration.entity";
import { Repository } from "typeorm";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { IAddItemRegistration } from "./interfaces/add-registration.interface";
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
            .leftJoinAndSelect('registration.room', 'room')
            .select(['registration.start_day', 'registration.end_day', 'registration.id', 'room.id', 'room.name', 'registration.quantity', 'item.id', 'item.name', 'item.specification', 'item.quantity'])
            .getMany()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)

    }

    async findByUserDayItem(uid: number, startDay: string, endDay: string, id: number, roomid: number) {
        const registration = await this.itemRegistrationRepository.createQueryBuilder('registration')
            .leftJoinAndSelect('registration.item', 'item')
            .leftJoinAndSelect('registration.room', 'room')
            .where('(registration.start_day <= :startDay AND registration.end_day >= :startDay AND registration.start_day <= :endDay AND (registration.end_day >= :endDay OR registration.end_day <= :endDay) AND item.id = :id AND registration.createBy = :uid AND registration.room_id = :roomid)', { startDay, endDay, id, uid, roomid })
            .select(['registration.start_day', 'registration.quantity', 'registration.end_day', 'registration.id', 'room.id', 'room.name', 'item.id', 'item.name'])
            .getOne()
        if (registration)
            return registration
    }

    async addItemReg(data: IAddItemRegistration) {
        let isReplace = false;
        const roomid = data.room.id
        const itemRegistration = await this.findByUserDayItem(data.user, data.start_day, data.end_day, data.itemId, roomid)
        if (itemRegistration) {
            isReplace = true;
            data.quantity += itemRegistration.quantity
            await this.itemRegistrationRepository.update({ id: itemRegistration.id }, {
                updatedAt: data.registration.createdAt,
                end_day: data.end_day,
                quantity: data.quantity
            })
            return;
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