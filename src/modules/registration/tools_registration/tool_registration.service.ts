import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ToolRegistrationEntity } from "./tool_registration.entity";
import { Repository } from "typeorm";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { AddItemRegistrationDto } from "../dtos/add-registration.dto";
import { ToolsService } from "src/modules/tools/tools.service";

@Injectable()
export class ToolRegistrationService {
    constructor(
        @InjectRepository(ToolRegistrationEntity) private readonly toolRegRepo: Repository<ToolRegistrationEntity>,
        private readonly toolService: ToolsService
    ) { }

    async findByRegistrationId(regid: number) {
        const registration = await this.toolRegRepo.createQueryBuilder('item')
            .where('item.registration_id = :registrationId', { registrationId: regid })
            .leftJoinAndSelect('item.tool', 'tool')
            .select(['item.start_day', 'item.end_day', 'item.id', 'item.quantity', 'tool.id', 'tool.name', 'tool.quantity'])
            .getMany()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)

    }

    async addToolReg(data: AddItemRegistrationDto) {
        let isReplace = false;
        const listToolReg = await this.findByRegistrationId(data.registration.id)
        const tool = await this.toolService.findById(data.itemId)
        listToolReg?.map(async (toolReg) => {
            if (data.itemId === toolReg.tool.id) {
                isReplace = true;
                data.quantity += toolReg.quantity;
                await this.toolRegRepo.createQueryBuilder()
                    .update(ToolRegistrationEntity)
                    .set({
                        quantity: data.quantity
                    })
                    .where('id = :id', { id: toolReg.id })
                    .execute();
                return;
            }
        })

        if (!isReplace) {
            delete data.itemId;
            delete data.user;
            const newItem = new ToolRegistrationEntity({ ...data, tool });
            await this.toolRegRepo.save(newItem);
            return;
        }
    }
}