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
import { EquipmentRegistrationEntity } from "./equipment_registration/equipment_registration.entity";
import { ChemicalRegistrationEntity } from "./chemicals_registration/chemical_registration.entity";

@Injectable()
export class RegistrationService {
    constructor(
        @InjectRepository(RegistrationEntity) private readonly registrationRepository: Repository<RegistrationEntity>,
        private readonly userService: UserService,
        private readonly equipmentService: EquipmentService,
        private readonly toolService: ToolsService,
        private readonly chemicalService: ChemicalsService,
        private readonly roomService: RoomService,
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
            .select(['registration', 'user.id', 'eqreg'])
            .where({ id })
            .getOne()
        if (registration)
            return registration
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)
    }

    async findByUserId(id: number) {

    }

    async handleAddListItem(data: AddRegistrationDto) {
        const addList = data.items;
        const listTool = await this.toolService.findAll();
        const listEquipment = await this.equipmentService.findAll();
        const listChemical = await this.chemicalService.findAll();
        let handleAddList = {};
        addList.map(item => {
            if (item.categoryId in CategoryEnum) {
                if (item.categoryId == CategoryEnum.EQUIPMENT) {
                    listEquipment.find(item2 => {
                        if (item2.id == item.itemId) {
                            if (handleAddList['equipment']?.length >= 1) {
                                let isReplace = false;
                                handleAddList['equipment']?.find(item3 => {
                                    if (item3.item.id === item.itemId) {
                                        isReplace = true;
                                        item3.quantity += item.quantity
                                        return;
                                    }
                                })
                                if (!isReplace) {
                                    handleAddList['equipment'].push({ item: { ...item2 }, quantity: item.quantity });
                                    return;
                                }
                            } else {
                                handleAddList['equipment'] = [{ item: { ...item2 }, quantity: item.quantity }];
                                return;
                            }
                        }
                        return;
                    })
                } else if (item.categoryId == CategoryEnum.TOOLS) {
                    listTool.find(item2 => {
                        if (item2.id == item.itemId) {
                            if (handleAddList['tools']?.length >= 1) {
                                let isReplace = false;
                                handleAddList['tools']?.find(item3 => {
                                    if (item3.item.id === item.itemId) {
                                        isReplace = true;
                                        item3.quantity += item.quantity
                                        return;
                                    }
                                })
                                if (!isReplace) {
                                    handleAddList['tools'].push({ item: { ...item2 }, quantity: item.quantity })
                                    return;
                                }
                            } else {
                                handleAddList['tools'] = [{ item: { ...item2 }, quantity: item.quantity }];
                                return;
                            }
                        }
                        return;
                    })
                } else if (item.categoryId == CategoryEnum.CHEMICALS) {
                    listChemical.find(item2 => {
                        if (item2.id == item.itemId) {
                            if (handleAddList['chemicals']?.length >= 1) {
                                let isReplace = false;
                                handleAddList['chemicals']?.find(item3 => {
                                    if (item3?.item.id === item.itemId) {
                                        isReplace = true;
                                        item3.quantity += item.quantity
                                        return;
                                    }
                                })
                                if (!isReplace) {
                                    handleAddList['chemicals'].push({ item: { ...item2 }, quantity: item.quantity })
                                    return;
                                }
                            } else {
                                handleAddList['chemicals'] = [{ item: { ...item2 }, quantity: item.quantity }];
                                return;
                            }
                        }
                        return;
                    })
                }
                return;
            }
            throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
        })
        return handleAddList;
    }

    async createRegistration(data: AddRegistrationDto) {
        const handleAddList = await this.handleAddListItem(data);
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