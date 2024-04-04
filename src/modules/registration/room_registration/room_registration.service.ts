import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomRegistrationEntity } from "./room_registration.entity";
import { Repository } from "typeorm";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { AddItemRegistrationDto, AddRoomItemRegistrationDto, AddRoomRegistrationDto } from "../dtos/add-registration.dto";
import { RoomService } from "src/modules/rooms/room.service";
import { ScheduleService } from "src/modules/schedules/schedule.service";

@Injectable()
export class RoomRegistrationService {
    constructor(
        @InjectRepository(RoomRegistrationEntity) private readonly roomRegRepo: Repository<RoomRegistrationEntity>,
        private readonly roomService: RoomService,
        private readonly scheduleService: ScheduleService
    ) { }

    async findByRegistrationId(regid: number) {
        const registration = await this.roomRegRepo.createQueryBuilder('item')
            .where('item.registration_id = :registrationId', { registrationId: regid })
            .leftJoinAndSelect('item.room', 'room')
            .select(['item.start_day', 'item.end_day', 'item.id', 'room.id', 'room.name'])
            .getMany()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)

    }

    async findByDay(startDay: string, endDay: string) {
        const registration = await this.roomRegRepo.createQueryBuilder('item')
            .where('(item.start_day >= :startDay AND item.start_day <= :endDay)', { startDay, endDay })
            .orWhere('(item.end_day >= :startDay AND item.end_day <= :endDay)', { startDay, endDay })
            .leftJoinAndSelect('item.room', 'room')
            .select(['item.start_day', 'item.end_day', 'item.id', 'room.id', 'room.name'])
            .getMany()
        if (registration)
            return registration
    }

    async addRoomReg(data: AddRoomItemRegistrationDto) {
        // const room = await this.roomService.findById(data.itemId)
        // let isReplace = false;
        // const listRoomReg = await this.findByDay(data.start_day, data.end_day)
        // listRoomReg?.map(async (roomReg) => {
        //     if (data.itemId === roomReg.room.id) {
        //         isReplace = true;
        //         data.quantity += roomReg.quantity;
        //         await this.roomRegRepo.createQueryBuilder()
        //             .update(RoomRegistrationEntity)
        //             .set({
        //                 quantity: data.quantity
        //             })
        //             .where('id = :id', { id: roomReg.id })
        //             .execute();
        //         return;
        //     }
        // })
        // delete data.itemId;
        // delete data.user;
        // const newItem = new RoomRegistrationEntity({ ...data, room });
        // await this.roomRegRepo.save(newItem);
    }
}