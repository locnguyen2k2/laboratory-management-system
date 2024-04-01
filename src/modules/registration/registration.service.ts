import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegistrationEntity } from "./registration.entity";
import { Repository } from "typeorm";
import { AddRegistrationDto } from "./dtos/add-registration.dto";
import { UserService } from "../user/user.service";
import { EquipmentService } from "../equipment/equipment.service";
import { EquipmentEntity } from "../equipment/equipment.entity";
import { ToolsService } from "../tools/tools.service";
import { CategoryEnum } from "../categories/category-enum";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { ChemicalsService } from "../chemicals/chemicals.service";
import { RoomService } from "../rooms/room.service";

@Injectable()
export class RegistrationService {
    constructor(
        @InjectRepository(RegistrationEntity) private readonly registrationRepository: Repository<RegistrationEntity>,
        private readonly userService: UserService,
        private readonly equipmentService: EquipmentService,
        private readonly toolService: ToolsService,
        private readonly chemicalService: ChemicalsService,
        private readonly roomService: RoomService
    ) { }

    async findAll() { }

    async findById() { }

    async findByUserId(uid: number) {

    }

    // async createRegistration(data: AddRegistrationDto) {
    //     const user = await this.userService.findById(data.user)
    //     delete data.user;
    //     return await this.registrationRepository.save(new RegistrationEntity({ ...data, user: user }))
    // }

    async handleAddEquipment(data: AddRegistrationDto) {
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
        const handleAddList = await this.handleAddEquipment(data);
        delete data.items;
        // const registrationDto = data;
        // const newRegistration = await this.createRegistration(registrationDto);
        return { data, handleAddList };
    }
}