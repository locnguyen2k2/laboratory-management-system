import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ItemEntity } from "./item.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { AddItemDto } from "./dtos/add-item.dto";
import { UpdateItemDto } from "./dtos/update-item.dto";
import { CategoryService } from "../categories/category.service";

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(ItemEntity) private readonly itemRepository: Repository<ItemEntity>,
        private readonly categoryService: CategoryService,
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
            .select(['item', 'category'])
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
        delete data.categoryId

        const newItem = await this.itemRepository.save(new ItemEntity({ ...data, category: category }));
        return newItem;
    }

    async update(id: number, data: UpdateItemDto) {
        const item = await this.findById(id);
        if (item) {
            const category = data.categoryId ? await this.categoryService.findById(data.categoryId) : item.category
            delete data.categoryId
            if (item && category) {
                const isExisted = await this.findByName(data.name, data.specification);
                if (isExisted && isExisted.id !== id) {
                    throw new HttpException(`The item is existed`, HttpStatus.BAD_REQUEST);
                }
                const info = {
                    ...data,
                    ...(data.name ? { name: data.name } : { name: item.name }),
                    ...(data.status ? { status: data.status } : { status: item.status }),
                    ...(data.serial_number ? { serial_number: data.serial_number } : { serial_number: item.serial_number }),
                    ...(data.unit ? { unit: data.unit } : { unit: item.unit }),
                    ...(data.quantity ? { quantity: data.quantity } : { quantity: item.quantity }),
                    ...(data.origin ? { origin: data.origin } : { origin: item.origin }),
                    ...(data.specification ? { specification: data.specification } : { specification: item.specification }),
                    ...(data.remark ? { remark: data.remark } : { remark: item.remark }),
                }
                await this.itemRepository.save({ ...item, category });
                await this.itemRepository.update({ id: id }, { ...info })
                return await this.findById(id);
            }
        }
        throw new HttpException(`The item or category not found`, HttpStatus.NOT_FOUND);
    }

}