import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ItemEntity } from "./item.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { AddItemDto } from "./dtos/add-item.dto";
import { UpdateItemDto } from "./dtos/update-item.dto";
import { CategoryService } from "../categories/category.service";
import { UnitService } from "../units/unit.service";

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(ItemEntity) private readonly itemRepository: Repository<ItemEntity>,
        private readonly categoryService: CategoryService,
        private readonly unitService: UnitService,
    ) { }

    async findAll() {
        return this.itemRepository
            .createQueryBuilder("item")
            .leftJoinAndSelect('item.category', 'category')
            .select(['item', 'category.id', 'category.name'])
            .getMany();
    }

    async findById(id: number) {
        const item = await this.itemRepository
            .createQueryBuilder("item")
            .where({ id: id })
            .leftJoinAndSelect('item.category', 'category')
            .leftJoinAndSelect('item.unit', 'unit')
            .select(['item', 'category', 'unit'])
            .getOne()
        if (item)
            return item
    }

    async findByName(name: string, specification: string) {
        return (
            await this.itemRepository
                .createQueryBuilder("item")
                .where('(replace(item.name, \' \', \'\') LIKE :name && replace(item.specification, \' \', \'\') LIKE :specification)',
                    { name: name.replace(/\s/g, ""), specification: specification.replace(/\s/g, "") })
                .getOne()
        )
    }

    async findByCategory(categoryId: number) {
        const item = await this.itemRepository
            .createQueryBuilder("item")
            .leftJoinAndSelect('item.category', 'category')
            .where('(category.id = :categoryId)', { categoryId: categoryId })
            .select(['item'])
            .getMany()
        if (item)
            return item
    }

    async add(data: AddItemDto) {
        const item = await this.findByName(data.name, data.specification);
        if (item) {
            throw new HttpException(`The item is existed`, HttpStatus.BAD_REQUEST);
        }
        const category = await this.categoryService.findById(data.categoryId);
        const unit = await this.unitService.findById(data.unitId);
        delete data.categoryId
        delete data.unitId

        const newItem = await this.itemRepository.save(new ItemEntity({ ...data, category: category, unit: unit }));
        return newItem;
    }

    async update(id: number, data: UpdateItemDto) {
        const item = await this.findById(id);
        const category = data.categoryId >= 0 ? await this.categoryService.findById(data.categoryId) : item.category
        const unit = data.unitId >= 0 ? await this.unitService.findById(data.unitId) : item.unit
        delete data.categoryId
        delete data.unitId
        if (item && category && unit) {
            const isExisted = await this.findByName(data.name, data.specification);
            if (isExisted && isExisted.id !== id) {
                throw new HttpException(`The item is existed`, HttpStatus.BAD_REQUEST);
            }
            const info = {
                ...data,
                ...(data.name ? { name: data.name } : { name: item.name }),
                ...(data.quantity ? { quantity: data.quantity } : { quantity: item.quantity }),
                ...(data.origin ? { origin: data.origin } : { origin: item.origin }),
                ...(data.specification ? { specification: data.specification } : { specification: item.specification }),
                ...(data.remark ? { remark: data.remark } : { remark: item.remark }),
            }
            await this.itemRepository.save({ ...item, category, unit });
            await this.itemRepository.update({ id: id }, { ...info })
            return await this.findById(id);
        }
        throw new HttpException(`The item, category or unit not found`, HttpStatus.NOT_FOUND);
    }

}