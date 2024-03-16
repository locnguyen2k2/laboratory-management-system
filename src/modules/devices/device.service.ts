import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeviceEntity } from "./device.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryService } from "../categories/category.service";
import { AddDeviceDto } from "./dtos/add-device.dto";
import { UpdateDeviceDto } from "./dtos/update-device.dto";

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(DeviceEntity) private readonly deviceRepository: Repository<DeviceEntity>,
        private readonly categoryService: CategoryService
    ) { }

    async findAll() {
        return this.deviceRepository
            .createQueryBuilder("item")
            .leftJoinAndSelect("item.category", "category")
            .getMany();
    }

    async findById(id: number) {
        const item = await this.deviceRepository
            .createQueryBuilder("item")
            .where({ id: id })
            .leftJoinAndSelect("item.category", "category")
            .getOne()
        return item ? item : new HttpException("The device not found", HttpStatus.NOT_FOUND);
    }

    async findByName(name: string) {
        return (
            await this.deviceRepository
                .createQueryBuilder("item")
                .where('replace(item.name, \' \', \'\') LIKE :name',
                    { name: name.replace(/\s/g, "") })
                .leftJoinAndSelect("item.category", "category")
                .getOne()
        )
    }

    async add(data: AddDeviceDto) {
        const category = await this.categoryService.findById(data.categoryId);
        if (category) {
            const device = await this.findByName(data.name);
            if (device) {
                throw new HttpException(`The device: ${device.name} is existed`, HttpStatus.BAD_REQUEST);
            }
            delete data.categoryId;
            const newDevice = new DeviceEntity({ ...data, category: category });
            await this.deviceRepository.save(newDevice);
            return newDevice;
        }
        throw new HttpException("The category not found", HttpStatus.NOT_FOUND);
    }

    async update(id: number, data: UpdateDeviceDto) {
        const device = await this.findById(id);
        const category = await this.categoryService.findById(data.categoryId);
        if (device && category) {
            const isExisted = await this.findByName(data.name);
            if (isExisted && isExisted.id !== id) {
                throw new HttpException(`The device: ${data.name} is existed`, HttpStatus.BAD_REQUEST);
            }
            delete data.categoryId;
            const updateDevice = new DeviceEntity({ ...data, category: category });
            await this.deviceRepository.update({ id: id }, updateDevice)
            return updateDevice;
        }
        throw new HttpException(`The device id or category not found`, HttpStatus.NOT_FOUND);
    }

    

}