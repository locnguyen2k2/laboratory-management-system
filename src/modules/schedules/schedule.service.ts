import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ScheduleEntity } from "./schedule.entity";
import { Repository } from "typeorm";
import { AddScheduleDto } from "./dtos/add-schedule.dto";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(ScheduleEntity) private readonly scheduleRepository: Repository<ScheduleEntity>
    ) { }

    async findByStart(start: string) {
        const schedule = (await this.scheduleRepository.find({ where: { start } }))[0];
        if (schedule)
            return schedule;
    }

    async addSchedule(data: AddScheduleDto) {
        const schedule = await this.findByStart(data.start);
        if (schedule) {
            throw new BusinessException(ErrorEnum.RECORD_IS_EXISTED)
        }
        return await this.scheduleRepository.save(new ScheduleEntity({ ...data }))
    }
}