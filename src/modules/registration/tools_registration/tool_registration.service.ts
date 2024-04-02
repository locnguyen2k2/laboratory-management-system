import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ToolRegistrationEntity } from "./tool_registration.entity";
import { Repository } from "typeorm";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";

@Injectable()
export class ToolRegistrationService {
    constructor(@InjectRepository(ToolRegistrationEntity) private readonly toolRegRepo: Repository<ToolRegistrationEntity>) { }

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

    async addToolReg(tool: any, quantity: number, start_day: string, end_day: string, registration: any, user: number) {
        const listToolReg = await this.findByRegistrationId(registration.id)
        let isReplace = false;
        listToolReg.map(async (toolReg) => {
            if (tool.id === toolReg.tool.id) {
                isReplace = true;
                toolReg.quantity += quantity;
                await this.toolRegRepo.createQueryBuilder()
                    .update(ToolRegistrationEntity)
                    .set({
                        quantity: toolReg.quantity
                    })
                    .where('id = :id', { id: toolReg.id })
                    .execute();
                return;
            }
        })
        if (isReplace === false) {
            const newItem = new ToolRegistrationEntity({ tool: tool, quantity: quantity, start_day, end_day, registration: registration, createBy: user, updateBy: user });
            await this.toolRegRepo.save(newItem);
            return;
        }
    }
}