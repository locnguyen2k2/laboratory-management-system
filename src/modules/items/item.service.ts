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
            .select(['item', 'category.id', 'category.name'])
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
            .select(['item', 'category.id', 'category.name'])
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
        const category = await this.categoryService.findById(data.categoryId)
        delete data.categoryId
        if (item) {
            const isExisted = await this.findByName(data.name, item.specification);
            if (isExisted && isExisted.id !== id) {
                throw new HttpException(`The item is existed`, HttpStatus.BAD_REQUEST);
            }
            await this.itemRepository.update({ id: id }, new ItemEntity({ ...data, category }))
            return await this.findById(id);
        }
        throw new HttpException(`The item not found`, HttpStatus.NOT_FOUND);
    }

}