import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StatisticEntity } from "./entities/statistic.entity";

@Injectable()
export class StatisticService {
    constructor(
        @InjectRepository(StatisticEntity) private readonly statisticRepository: Repository<StatisticEntity>,
    ){}
}