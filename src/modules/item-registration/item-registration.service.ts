import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemRegistrationEntity } from "./item-registration.entity";
import { Repository } from "typeorm";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { IAddItemRegistration } from "./interfaces/add-registration.interface";
import { ItemService } from "src/modules/items/item.service";
import { UpdateItemRegistrationDto } from "./dtos/update-borrowing.dto";
import { RoomEntity } from "../rooms/room.entity";

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
            .select(['registration.status', 'registration.start_day', 'registration.end_day', 'registration.id', 'room.id', 'room.name', 'registration.quantity', 'item.id', 'item.name', 'item.specification', 'item.quantity'])
            .getMany()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)

    }

    async findByUserDayItem(uid: number, startDay: number, endDay: number, id: number, roomid: number) {
        const registration = await this.itemRegistrationRepository.createQueryBuilder('registrationItem')
            .leftJoinAndSelect('registrationItem.item', 'item')
            .leftJoinAndSelect('registrationItem.room', 'room')
            .leftJoinAndSelect('registrationItem.registration', 'registration')
            .where('(registrationItem.start_day <= :startDay AND registrationItem.end_day >= :startDay AND registrationItem.start_day <= :endDay AND (registrationItem.end_day >= :endDay OR registrationItem.end_day <= :endDay) AND item.id = :id AND registrationItem.createBy = :uid AND registrationItem.room_id = :roomid)', { startDay, endDay, id, uid, roomid })
            .select(['registration.id' as 'registrationId', 'registrationItem.status', 'registrationItem.start_day', 'registrationItem.quantity', 'registrationItem.end_day', 'registrationItem.id', 'room.id', 'room.name', 'item.id', 'item.name'])
            .getOne()
        if (registration)
            return registration
    }

    async findByUidRegid(uid: number, id: number) {
        const registration = await this.itemRegistrationRepository.createQueryBuilder('registrationItem')
            .leftJoinAndSelect('registrationItem.item', 'item')
            .leftJoinAndSelect('registrationItem.room', 'room')
            .leftJoinAndSelect('registrationItem.registration', 'registration')
            .where('(registrationItem.createBy = :uid AND registrationItem.id = :id)', { uid, id })
            .select(['registration.id' as 'registrationId', 'registrationItem.status', 'registrationItem.start_day', 'registrationItem.quantity', 'registrationItem.end_day', 'registrationItem.id', 'room.id', 'room.name', 'item.id', 'item.name'])
            .getOne()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)
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
                quantity: data.quantity,
                status: data.status
            })
            return itemRegistration.registration.id;
        }
        if (!isReplace) {
            const item = await this.itemService.findById(data.itemId)
            delete data.itemId;
            delete data.user;
            const newItem = new ItemRegistrationEntity({ ...data, item });
            await this.itemRegistrationRepository.save(newItem);
            return data.registration.id;
        }
    }

    async update(id: number, uid: number, data: UpdateItemRegistrationDto, room: RoomEntity) {
        const beforeItemReg = await this.findByUidRegid(uid, id);
        await this.itemRegistrationRepository.update({ id }, {
            item: await this.itemService.findById(data.items.itemId),
            quantity: data.items.quantity,
            room: room,
            status: data.items.status,
            end_day: data.end_day === 0 ? beforeItemReg.end_day : data.end_day,
            updateBy: uid,
        })
        return this.findByUidRegid(uid, id)
    }

}