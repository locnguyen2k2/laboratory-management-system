import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegistrationEntity } from "./registration.entity";
import { Repository } from "typeorm";
import { AddRegistrationDto } from "./dtos/add-registration.dto";
import { UserService } from "../user/user.service";
import { EquipmentService } from "../equipment/equipment.service";
import { ToolsService } from "../tools/tools.service";
import { CategoryEnum } from "../categories/category-enum";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { ChemicalsService } from "../chemicals/chemicals.service";
import { RoomService } from "../rooms/room.service";
import { EquipmentRegistrationService } from "./equipment_registration/equipment_registration.service";
import { ToolRegistrationService } from "./tools_registration/tool_registration.service";
import { ChemicalRegistrationService } from "./chemicals_registration/chemical_registration.service";

@Injectable()
export class RegistrationService {
    constructor(
        @InjectRepository(RegistrationEntity) private readonly registrationRepository: Repository<RegistrationEntity>,
        private readonly userService: UserService,
        private readonly equipmentService: EquipmentService,
        private readonly toolService: ToolsService,
        private readonly chemicalService: ChemicalsService,
        private readonly equipmentRegService: EquipmentRegistrationService,
        private readonly toolRegService: ToolRegistrationService,
        private readonly chemicalRegService: ChemicalRegistrationService
    ) { }

    async findAll() { }

    async findById(id: number) {
        const registration = await this.registrationRepository
            .createQueryBuilder('registration')
            .leftJoinAndSelect('registration.user', 'user')
            .select(['registration', 'user.id'])
            .where({ id })
            .getOne()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)
    }

    async getDetailById(id: number) {
        const registration = await this.registrationRepository
            .createQueryBuilder('registration')
            .leftJoinAndSelect('registration.user', 'user')
            .select(['registration', 'user.id'])
            .where({ id })
            .getOne()
        if (registration) {
            const equipment = await this.equipmentRegService.findByRegistrationId(id);
            const tools = await this.toolRegService.findByRegistrationId(id);
            const chemicals = await this.chemicalRegService.findByRegistrationId(id);
            return { registration, equipment_registration: equipment, tool_registration: tools, chemical_registration: chemicals };
        }
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)
    }

    async handleAddListItem(items: { categoryId: number, itemId: number, quantity: number }[]) {
        let listItem = {};
        let handleAddList = {};

        items.map(item => {
            if (item.categoryId == CategoryEnum.EQUIPMENT) {
                if (listItem['equipment']?.length >= 1) {
                    let isReplace = false;
                    listItem['equipment']?.map(({ itemId }: any, index: any) => {
                        if (itemId === item.itemId) {
                            isReplace = true;
                            listItem['equipment'][index].quantity += item.quantity;
                            return;
                        }
                    })
                    if (!isReplace)
                        listItem['equipment'].push(item);
                } else {
                    listItem['equipment'] = [item];
                }
            } else if (item.categoryId == CategoryEnum.TOOLS) {
                if (listItem['tools']?.length >= 1) {
                    let isReplace = false;
                    listItem['tools']?.map(({ itemId }: any, index: any) => {
                        if (itemId === item.itemId) {
                            isReplace = true;
                            listItem['tools'][index].quantity += item.quantity;
                            return;
                        }
                    })
                    if (!isReplace)
                        listItem['tools'].push(item);
                } else {
                    listItem['tools'] = [item];
                }
            } else if (item.categoryId == CategoryEnum.CHEMICALS) {
                if (listItem['chemicals']?.length >= 1) {
                    let isReplace = false;
                    listItem['chemicals']?.map(({ itemId }: any, index: any) => {
                        if (itemId === item.itemId) {
                            isReplace = true;
                            listItem['chemicals'][index].quantity += item.quantity;
                            return;
                        }
                    })
                    if (!isReplace)
                        listItem['chemicals'].push(item);
                } else {
                    listItem['chemicals'] = [item];
                }
            }
        })

        if (listItem['equipment']) {
            await Promise.all(listItem['equipment']?.map(async (item) => {
                const equipment = await this.equipmentService.findById(item.itemId)
                if (equipment) {
                    if (handleAddList['equipment']?.length >= 1) {
                        handleAddList['equipment'].push({ item: { ...equipment }, quantity: item.quantity });
                        return;
                    } else {
                        handleAddList['equipment'] = [{ item: { ...equipment }, quantity: item.quantity }];
                        return;
                    }
                }
                return;
            }))
        }
        if (listItem['tools']) {
            await Promise.all(listItem['tools']?.map(async (item) => {
                const tool = await this.toolService.findById(item.itemId)
                if (tool) {
                    if (handleAddList['tools']?.length >= 1) {
                        handleAddList['tools'].push({ item: { ...tool }, quantity: item.quantity });
                        return;
                    } else {
                        handleAddList['tools'] = [{ item: { ...tool }, quantity: item.quantity }];
                        return;
                    }
                }
                return;
            }))
        }
        if (listItem['chemicals']) {
            await Promise.all(listItem['chemicals']?.map(async (item) => {
                const chemical = await this.chemicalService.findById(item.itemId)
                if (chemical) {
                    if (handleAddList['chemicals']?.length >= 1) {
                        handleAddList['chemicals'].push({ item: { ...chemical }, quantity: item.quantity });
                        return;
                    } else {
                        handleAddList['chemicals'] = [{ item: { ...chemical }, quantity: item.quantity }];
                        return;
                    }
                }
                return;
            }))
        }

        return handleAddList;
    }

    async createRegistration(data: AddRegistrationDto) {
        data.items.some(item => {
            if (!(item.categoryId in CategoryEnum)) {
                throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
            }
        })
        const handleAddList = await this.handleAddListItem(data.items);
        const user = await this.userService.findById(data.user)
        delete data.user;
        delete data.items;
        const registration = await this.registrationRepository.save(new RegistrationEntity({ ...data, user: user }));

        handleAddList?.['equipment']?.map(async ({ item, quantity }): Promise<any> => {
            await this.equipmentRegService.addEquipmentReg(item, quantity, registration, registration.createBy)
        })
        handleAddList?.['tools']?.map(async ({ item, quantity }): Promise<any> => {
            await this.toolRegService.addToolReg(item, quantity, registration, registration.createBy)
        })
        handleAddList?.['chemicals']?.map(async ({ item, quantity }): Promise<any> => {
            await this.chemicalRegService.addChemicalReg(item, quantity, registration, registration.createBy)
        })

        throw new BusinessException("Registration is successfull");
    }
}