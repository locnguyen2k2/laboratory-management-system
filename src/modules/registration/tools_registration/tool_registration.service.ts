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
            .getMany()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)

    }

    async addToolReg(item: any, quantity: number, registration: any, user: number) {
        const toolReg = await this.findByRegistrationId(registration.id)
        let isReplace = false;
        toolReg.map(async (tool) => {
            if (item.id === tool.tool.id) {
                isReplace = true;
                tool.quantity += quantity;
                await this.toolRegRepo.createQueryBuilder()
                    .update(ToolRegistrationEntity)
                    .set({
                        quantity: tool.quantity
                    })
                    .where('id = :id', { id: tool.id })
                    .execute();
                return;
            }
        })
        if (isReplace === false) {
            const newItem = new ToolRegistrationEntity({ tool: item, quantity: quantity, registration: registration, createBy: user, updateBy: user });
            await this.toolRegRepo.save(newItem);
            return;
        }
    }
}