import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { EquipmentEntity } from "./equipment.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { AddEquipmentDto } from "./dtos/add-equipment.dto";
import { UpdateEquipmentDto } from "./dtos/update-equipment.dto";
import { CategoryService } from "../categories/category.service";

@Injectable()
export class EquipmentService {
    constructor(
        @InjectRepository(EquipmentEntity) private readonly equipmentRepository: Repository<EquipmentEntity>,
        private readonly categoryService: CategoryService,
    ) { }

    async findAll() {
        return this.equipmentRepository
            .createQueryBuilder("item")
            .getMany();
    }

    async findById(id: number) {
        const item = await this.equipmentRepository
            .createQueryBuilder("item")
            .where({ id: id })
            .getOne()
        return item ? item : new HttpException("The equipment not found", HttpStatus.NOT_FOUND);
    }

    async findByName(name: string) {
        return (
            await this.equipmentRepository
                .createQueryBuilder("item")
                .where('replace(item.name, \' \', \'\') LIKE :name',
                    { name: name.replace(/\s/g, "") })
                .getOne()
        )
    }

    async add(data: AddEquipmentDto) {
        const equipment = await this.findByName(data.name);
        if (equipment) {
            throw new HttpException(`The equipment is existed`, HttpStatus.BAD_REQUEST);
        }
        const category = await this.categoryService.findById(data.categoryId);
        delete data.categoryId
        const newItem = await this.equipmentRepository.save(new EquipmentEntity({ ...data, category: category }));
        return newItem;
    }

    async update(id: number, data: UpdateEquipmentDto) {
        const equipment = await this.findById(id);
        if (equipment) {
            const isExisted = await this.findByName(data.name);
            if (isExisted && isExisted.id !== id) {
                throw new HttpException(`The equipment is existed`, HttpStatus.BAD_REQUEST);
            }
            await this.equipmentRepository.update({ id: id }, new EquipmentEntity({ ...data }))
            return await this.findById(id);
        }
        throw new HttpException(`The equipment not found`, HttpStatus.NOT_FOUND);
    }

}