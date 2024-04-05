import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomRegistrationEntity } from "./room_registration.entity";
import { Repository } from "typeorm";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { AddRoomItemRegistrationDto } from "../dtos/add-registration.dto";
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
        const roomRegistration = await this.roomRegRepo.createQueryBuilder('item')
            .where('item.registration_id = :registrationId', { registrationId: regid })
            .leftJoinAndSelect('item.room', 'room')
            .select(['item.start_day', 'item.end_day', 'item.id', 'room.id', 'room.name'])
            .getMany()
        if (roomRegistration) {
            await Promise.all(roomRegistration.map(async (roomReg) => {
                roomReg['schedules'] = await this.scheduleService.findDetailByRegistrationId(roomReg.id);
            }))
            return roomRegistration
        }
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)

    }

    async findByDay(startDay: string, endDay: string, id: number) {
        const registration = await this.roomRegRepo.createQueryBuilder('item')
            .where('(item.start_day >= :startDay AND item.start_day <= :endDay)', { startDay, endDay })
            .orWhere('(item.end_day >= :startDay AND item.end_day <= :endDay)', { startDay, endDay })
            .andWhere('item.room_id = :id', { id })
            .leftJoinAndSelect('item.room', 'room')
            .select(['item.start_day', 'item.end_day', 'item.id', 'room.id', 'room.name'])
            .getMany()
        if (registration)
            return registration
    }

    async addRoomReg(data: AddRoomItemRegistrationDto): Promise<boolean> {
        const roomRegistration = await this.findByDay(data.start_day, data.end_day, data.itemId);
        const regScheculdes = [];
        let isNotExisted = true;
        await Promise.all(roomRegistration?.map(async (roomReg) => {
            const scheduleId = await this.scheduleService.findByRoomRegistrationId(roomReg.id)
            if (scheduleId)
                regScheculdes.push({ regid: roomReg.id, scheduleId })
        }))
        regScheculdes.map(roomReg => {
            if (roomReg.scheduleId?.some((schedule: number) => data.schedules.includes(schedule))) {
                isNotExisted = false;
                return;
            }
        })
        if (isNotExisted) {
            delete data.user;
            const room = await this.roomService.findById(data.itemId);
            const newRoomRegistration = new RoomRegistrationEntity({ createBy: data.createBy, updateBy: data.createBy, start_day: data.start_day, end_day: data.end_day, registration: data.registration, room: room })
            await this.roomRegRepo.save(newRoomRegistration);
            await Promise.all(data.schedules.map(async (scheduleId: number) => {
                const schedule = await this.scheduleService.findById(scheduleId)
                await this.roomRegRepo.createQueryBuilder()
                    .relation(RoomRegistrationEntity, "times")
                    .of(newRoomRegistration)
                    .add(schedule);
            }))
        }
        return isNotExisted;
    }
}