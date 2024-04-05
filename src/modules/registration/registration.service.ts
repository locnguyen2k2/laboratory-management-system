import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegistrationEntity } from "./registration.entity";
import { Repository } from "typeorm";
import { AddRegistrationDto, AddRoomItemRegistrationDto, AddRoomRegistrationDto } from "./dtos/add-registration.dto";
import { UserService } from "../user/user.service";
import { EquipmentService } from "../equipment/equipment.service";
import { ToolsService } from "../tools/tools.service";
import { CategoryEnum } from "../categories/category.constant";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { ChemicalsService } from "../chemicals/chemicals.service";
import { EquipmentRegistrationService } from "./equipment_registration/equipment_registration.service";
import { ToolRegistrationService } from "./tools_registration/tool_registration.service";
import { ChemicalRegistrationService } from "./chemicals_registration/chemical_registration.service";
import { ItemRegistration, RoomRegistration } from "./registration.constant";
import { RoomService } from "../rooms/room.service";
import { RoomRegistrationService } from "./room_registration/room_registration.service";
import { ScheduleService } from "../schedules/schedule.service";

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
        private readonly chemicalRegService: ChemicalRegistrationService,
        private readonly roomService: RoomService,
        private readonly scheduleService: ScheduleService,
        private readonly roomRegService: RoomRegistrationService
    ) { }

    async findAll() {
        return await this.registrationRepository.find()
    }

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
            const rooms = await this.roomRegService.findByRegistrationId(id)
            return { registration, equipment, tools, chemicals, rooms };
        }
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)
    }

    async handleAddListItem(items: ItemRegistration[]) {
        let listItem = {};
        await Promise.all(items.map(async (item) => {
            if (item.categoryId == CategoryEnum.EQUIPMENT && await this.equipmentService.findById(item.itemId)) {
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
                        listItem = { ...listItem, equipment: [...listItem['equipment'], { itemId: item.itemId, categoryId: item.categoryId, quantity: item.quantity }] }
                } else {
                    listItem = { ...listItem, equipment: [{ itemId: item.itemId, categoryId: item.categoryId, quantity: item.quantity }] }
                }
            } else if (item.categoryId == CategoryEnum.TOOLS && await this.toolService.findById(item.itemId)) {
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
                        listItem = { ...listItem, tools: [...listItem['tools'], { itemId: item.itemId, categoryId: item.categoryId, quantity: item.quantity }] }
                } else {
                    listItem = { ...listItem, tools: [{ itemId: item.itemId, categoryId: item.categoryId, quantity: item.quantity }] }
                }
            } else if (item.categoryId == CategoryEnum.CHEMICALS && await this.chemicalService.findById(item.itemId)) {
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
                        listItem = { ...listItem, chemicals: [...listItem['chemicals'], { itemId: item.itemId, categoryId: item.categoryId, quantity: item.quantity }] }
                } else {
                    listItem = { ...listItem, chemicals: [{ itemId: item.itemId, categoryId: item.categoryId, quantity: item.quantity }] }
                }
            }
        }))
        return listItem;
    }

    async handleAddRoom(items: RoomRegistration[]) {
        let listItem = {};
        await Promise.all(items.map(async (item) => {
            if (await this.roomService.findById(item.itemId) && item?.schedules.length >= 1) {
                let checkSchedule = true;
                await Promise.all(item.schedules.map(async (id: number) => {
                    if (!(await this.scheduleService.findById(id))) {
                        checkSchedule = false;
                        return;
                    }
                }))
                if (checkSchedule) {
                    if (listItem['rooms']?.length >= 1) {
                        let isReplace = false;
                        listItem['rooms']?.map(({ itemId }: any, index: any) => {
                            if (itemId === item.itemId) {
                                isReplace = true;
                                return;
                            }
                        })
                        if (!isReplace)
                            listItem = { ...listItem, rooms: [...listItem['rooms'], { itemId: item.itemId, schedules: item.schedules }] }
                    } else {
                        listItem = { ...listItem, rooms: [{ itemId: item.itemId, schedules: item.schedules }] }
                    }
                }
            }
        }))
        return listItem;
    }

    async createRegistration(data: AddRegistrationDto) {
        // Check: date
        const { start_day, end_day } = data;
        if (start_day > end_day) {
            throw new BusinessException(ErrorEnum.INVALID_DATE);
        }
        // Check: categories
        data.items.some((item: ItemRegistration) => {
            if (!(item.categoryId in [CategoryEnum.EQUIPMENT, CategoryEnum.CHEMICALS, CategoryEnum.TOOLS])) {
                throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
            }
        })
        // Check: Equipment, tools, chemicals, rooms
        const handleAddList = await this.handleAddListItem(data.items);

        const user = await this.userService.findById(data.user)
        const registration = new RegistrationEntity({ createBy: data.createBy, updateBy: data.updateBy, user });
        await this.registrationRepository.save(registration);
        delete data.items;
        if (handleAddList?.['equipment']?.length >= 1 || handleAddList?.['tools']?.length >= 1 || handleAddList?.['chemicals']?.length >= 1) {
            handleAddList?.['equipment']?.map(async ({ itemId, quantity }) => {
                await this.equipmentRegService.addEquipmentReg({ itemId, quantity, ...data, registration })
            })
            handleAddList?.['tools']?.map(async ({ itemId, quantity }): Promise<any> => {
                await this.toolRegService.addToolReg({ itemId, quantity, ...data, registration })
            })
            handleAddList?.['chemicals']?.map(async ({ itemId, quantity }): Promise<any> => {
                await this.chemicalRegService.addChemicalReg({ itemId, quantity, ...data, registration })
            })
            throw new BusinessException("Registration is successfull");
        }
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)
    }

    async createRoomRegistration(data: AddRoomRegistrationDto) {
        // Check: date
        const { start_day, end_day } = data;
        if (start_day > end_day) {
            throw new BusinessException(ErrorEnum.INVALID_DATE);
        }
        // Check: Equipment, tools, chemicals, rooms
        const handleAddList = await this.handleAddRoom(data.items);
        const user = await this.userService.findById(data.user)
        const registration = new RegistrationEntity({ createBy: data.createBy, updateBy: data.updateBy, user });
        await this.registrationRepository.save(registration);
        delete data.items;
        let add = true;
        if (handleAddList?.['rooms']?.length >= 1) {
            await Promise.all(handleAddList?.['rooms']?.map(async ({ itemId, schedules }): Promise<any> => {
                add = await this.roomRegService.addRoomRegstration({ itemId, schedules, registration, ...data })
                if (!add)
                    return;
            }))
            if (!add) {
                throw new BadRequestException('Room is registrated!')
            }
            throw new BusinessException("Registration is successfull");
        }
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)
    }
}