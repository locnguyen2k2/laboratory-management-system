import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ScheduleEntity } from "./schedule.entity";
import { Repository } from "typeorm";

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(ScheduleEntity) private readonly scheduleRepository: Repository<ScheduleEntity>
    ) { }
    
}