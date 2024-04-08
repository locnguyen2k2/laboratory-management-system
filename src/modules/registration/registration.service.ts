import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegistrationEntity } from "./registration.entity";
import { Repository } from "typeorm";
import { AddRegistrationDto } from "./dtos/add-registration.dto";
import { UserService } from "../user/user.service";
import { ItemService } from "../items/item.service";
import { CategoryEnum } from "../categories/category.constant";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { ItemRegistrationService } from "./item_registration/item_registration.service";
import { ItemRegistration } from "./registration.constant";
import { isEmpty } from "lodash";

@Injectable()
export class RegistrationService {
    constructor(
        @InjectRepository(RegistrationEntity) private readonly registrationRepository: Repository<RegistrationEntity>,
        private readonly userService: UserService,
        private readonly itemService: ItemService,
        private readonly itemRegistrationServce: ItemRegistrationService,
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
            const items = await this.itemRegistrationServce.findByRegistrationId(id);
            return { registration, items };
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

    async createRegistration(data: AddRegistrationDto) {

        const { start_day, end_day, items } = data;
        delete data.items;
        let isItem = true;
        // Check: date, categories, items;
        if (start_day > end_day) {
            throw new BusinessException(ErrorEnum.INVALID_DATE);
        }
        await Promise.all(items.map(async (item: ItemRegistration) => {
            if (!(item.quantity >= 1)) {
                isItem = false;
                return;
            }
            if (!(await this.itemService.findById(item.itemId))) {
                isItem = false;
                return;
            }
        }))
        if (!isItem) {
            throw new BusinessException("404:Item not found or quantity is less than 1!")
        }

        const handleItems = await this.handleItems(items)
        if (!handleItems) {
            throw new BusinessException('404:Nothing changes')
        }
        let isCreated = false;
        const registration = await this.addRegistration(data.createBy, data.updateBy, data.user)
        await Promise.all(handleItems?.map(async ({ itemId, quantity }) => {
            await this.itemRegistrationServce.addItemReg({ itemId, quantity, ...data, registration })
            const items = await this.itemRegistrationServce.findByRegistrationId(registration.id)
            if (!isEmpty(items)) {
                isCreated = true;
            }
        }))
        if (!isCreated)
            await this.registrationRepository.delete({ id: registration.id })
        throw new BusinessException("Registration is success")
    }
}