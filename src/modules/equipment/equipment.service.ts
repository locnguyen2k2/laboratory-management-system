import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { EquipmentEntity } from "./equipment.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryService } from "../categories/category.service";
import { AddEquipmentDto } from "./dtos/add-equipment.dto";
import { UpdateEquipmentDto } from "./dtos/update-equipment.dto";

@Injectable()
export class EquipmentService {
    constructor(
        @InjectRepository(EquipmentEntity) private readonly equipmentRepository: Repository<EquipmentEntity>,
        private readonly categoryService: CategoryService
    ) { }

    async findAll() {
        return this.equipmentRepository
            .createQueryBuilder("item")
            .leftJoinAndSelect("item.category", "category")
            .getMany();
    }

    async findById(id: number) {
        const item = await this.equipmentRepository
            .createQueryBuilder("item")
            .where({ id: id })
            .leftJoinAndSelect("item.category", "category")
            .getOne()
        return item ? item : new HttpException("The equipment not found", HttpStatus.NOT_FOUND);
    }

    async findByName(name: string) {
        return (
            await this.equipmentRepository
                .createQueryBuilder("item")
                .where('replace(item.name, \' \', \'\') LIKE :name',
                    { name: name.replace(/\s/g, "") })
                .leftJoinAndSelect("item.category", "category")
                .getOne()
        )
    }

    async add(data: AddEquipmentDto) {
        const category = await this.categoryService.findById(data.categoryId);
        if (category) {
            const equipment = await this.findByName(data.name);
            if (equipment) {
                throw new HttpException(`The equipment: ${equipment.name} is existed`, HttpStatus.BAD_REQUEST);
            }
            delete data.categoryId;
            const newEquipment = new EquipmentEntity({ ...data, category: category });
            await this.equipmentRepository.save(newEquipment);
            return newEquipment;
        }
        throw new HttpException("The category not found", HttpStatus.NOT_FOUND);
    }

    async update(id: number, data: UpdateEquipmentDto) {
        const equipment = await this.findById(id);
        const category = await this.categoryService.findById(data.categoryId);
        if (equipment && category) {
            const isExisted = await this.findByName(data.name);
            if (isExisted && isExisted.id !== id) {
                throw new HttpException(`The equipment: ${data.name} is existed`, HttpStatus.BAD_REQUEST);
            }
            delete data.categoryId;
            const updateEquipment = new EquipmentEntity({ ...data, category: category });
            await this.equipmentRepository.update({ id: id }, updateEquipment)
            return updateEquipment;
        }
        throw new HttpException(`The equipment id or category not found`, HttpStatus.NOT_FOUND);
    }



}