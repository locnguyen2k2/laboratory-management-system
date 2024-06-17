import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StatisticEntity } from "./entities/statistic.entity";
import { StatisticService } from "./statistic.service";

@ApiBearerAuth()
@ApiTags('Statistic')
@Controller('statistic')
export class StatisticController {
    constructor(
        private readonly statisticService: StatisticService
    ){}
}