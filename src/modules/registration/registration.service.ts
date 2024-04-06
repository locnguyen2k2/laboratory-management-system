import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegistrationEntity } from "./registration.entity";
import { Repository } from "typeorm";
import { AddRegistrationDto, AddRoomRegistrationDto } from "./dtos/add-registration.dto";
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
import { isEmpty } from "lodash";
import { UserEntity } from "../user/user.entity";

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

    async addRegistration(createBy: number, updateBy: number, uid: number) {
        const user = await this.userService.findById(uid)
        const registration = new RegistrationEntity({ createBy: createBy, updateBy: updateBy, user });
        return await this.registrationRepository.save(registration);
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

    async handleItems(items: ItemRegistration[]) {
        let listItem = [];
        items.map(async (item) => {
            if (isEmpty(listItem)) {
                listItem = [{ ...item }];
            } else {
                const index = listItem.findIndex(value => value.itemId === item.itemId);
                if (index !== -1 && item?.quantity) {
                    listItem[index].quantity += item.quantity;
                } else {
                    listItem.push({ ...item });
                }
            }
        })
        if (listItem.length >= 1)
            return listItem;
    }

    async handleRooms(items: RoomRegistration[]) {
        let listItem = [];
        items.map(async (item) => {
            if (isEmpty(listItem)) {
                listItem = [{ ...item }];
            } else {
                const index = listItem.findIndex(value => value.itemId === item.itemId);
                if (index !== -1) {
                    listItem[index].schedules = [...new Set([...listItem[index].schedules, ...item.schedules])];
                } else {
                    listItem.push({ ...item });
                }
            }
        })
        if (listItem.length >= 1)
            return listItem;
    }

    async createRegistration(data: AddRegistrationDto) {

        const { start_day, end_day, items } = data;
        delete data.items;
        let isCategory = true;
        let isItem = true;
        // Check: date, categories, equipment, tools, chemicals, rooms
        if (start_day > end_day) {
            throw new BusinessException(ErrorEnum.INVALID_DATE);
        }
        await Promise.all(items.map(async (item: ItemRegistration) => {
            if (!(item.categoryId in [CategoryEnum.EQUIPMENT, CategoryEnum.CHEMICALS, CategoryEnum.TOOLS])) {
                isCategory = false;
                return;
            }
            if (!(item.quantity >= 1)) {
                isItem = false;
                return;
            }
            if (item.categoryId === CategoryEnum.EQUIPMENT && !(await this.equipmentService.findById(item.itemId))) {
                isItem = false;
                return;
            }
            if (item.categoryId === CategoryEnum.TOOLS && !(await this.toolService.findById(item.itemId))) {
                isItem = false;
                return;
            }
            if (item.categoryId === CategoryEnum.CHEMICALS && !(await this.chemicalService.findById(item.itemId))) {
                isItem = false;
                return;
            }
        }))
        if (!isCategory) {
            throw new BusinessException('404:The category should be (0, 1, 2)!');
        }
        if (!isItem) {
            throw new BusinessException("404:Item not found or quantity is less than 1!")
        }

        let equipment = items.filter(item => item.categoryId === CategoryEnum.EQUIPMENT)
        let chemicals = items.filter(item => item.categoryId === CategoryEnum.CHEMICALS)
        let tools = items.filter(item => item.categoryId === CategoryEnum.TOOLS)

        equipment = await this.handleItems(equipment)
        chemicals = await this.handleItems(chemicals)
        tools = await this.handleItems(tools)

        if (!equipment && !chemicals && !tools) {
            throw new BusinessException('404:Nothing changes')
        }

        const registration = await this.addRegistration(data.createBy, data.updateBy, data.user)
        equipment?.map(async ({ itemId, quantity }) => {
            await this.equipmentRegService.addEquipmentReg({ itemId, quantity, ...data, registration })
        })
        tools?.map(async ({ itemId, quantity }) => {
            await this.toolRegService.addToolReg({ itemId, quantity, ...data, registration })
        })
        chemicals?.map(async ({ itemId, quantity }) => {
            await this.chemicalRegService.addChemicalReg({ itemId, quantity, ...data, registration })
        })
        throw new BusinessException("Registration is success")
    }

    async createRoomRegistration(data: AddRoomRegistrationDto) {
        // Check: date
        const { start_day, end_day, items } = data;
        let isNotExistSchedule = false;
        let isRoom = true;
        delete data.items;
        if (start_day > end_day) {
            throw new BusinessException(ErrorEnum.INVALID_DATE);
        }
        // Check: rooms
        await Promise.all(items.map(async (item: RoomRegistration) => {
            if (!(await this.roomService.findById(item.itemId)) || !(item?.schedules.length >= 1)) {
                isRoom = false;
                return;
            }
        }))
        if (!isRoom) {
            throw new BusinessException("404:Item or schedules is empty!")
        }
        // Check: schedules
        items.map(async ({ schedules }) => {
            if (isNotExistSchedule) {
                return;
            }
            isNotExistSchedule = schedules.some(scheduleId => (scheduleId > 13 || scheduleId < 1))
        })
        if (isNotExistSchedule) {
            throw new BusinessException("404:Schedule does not exist!");
        }
        const rooms = await this.handleRooms(items);

        if (rooms.length >= 1) {
            let add = false;
            const registration = await this.addRegistration(data.createBy, data.updateBy, data.user)
            await Promise.all(rooms?.map(async ({ itemId, schedules }): Promise<any> => {
                add = await this.roomRegService.addRoomRegstration({ itemId, schedules, registration, ...data })
                if (!add)
                    return;
            }))
            if (!add) {
                await this.registrationRepository.delete({ id: registration.id })
                throw new BusinessException('404:Room is registrated!')
            }
            throw new BusinessException("Registration is success")
        }
        throw new BusinessException('404:Nothing changes')
    }
}