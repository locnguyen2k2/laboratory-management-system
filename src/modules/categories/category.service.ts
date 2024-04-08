import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CategoryEntity } from "./category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AddCategoryDto } from "./dtos/add-category.dto";
import { UpdateDto } from "./dtos/update.dto";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    ) { }

    async findAll() {
        return this.categoryRepository.find();
    }

    async findById(id: number) {
        return (await this.categoryRepository.find({ where: { id: id } }))[0];
    }

    async findByName(name: string) {
        return (
            await this.categoryRepository
                .createQueryBuilder("item")
                .where('replace(item.name, \' \', \'\') LIKE :name',
                    { name: name.replace(/\s/g, "") })
                .getOne()
        )
    }

    async add(data: AddCategoryDto) {
        const isExisted = await this.findByName(data.name);
        if (isExisted) {
            throw new HttpException("The category is existed", HttpStatus.BAD_REQUEST);
        }
        const newCategory = new CategoryEntity(data)
        await this.categoryRepository.save(newCategory);
        return await this.findByName(data.name);
    }

    async update(id: number, data: UpdateDto) {
        const category = await this.findById(id);
        const isExisted = await this.findByName(data.name)
        if (isExisted && isExisted.id !== id) {
            throw new BusinessException(ErrorEnum.RECORD_IS_EXISTED)
        }
        if (category) {
            await this.categoryRepository.update({ id: id }, { name: data.name })
            return "The category is updated successfully!";
        }
        throw new HttpException("The category not found", HttpStatus.NOT_FOUND);
    }

    // async delete(id: number) {
    //     if (await this.findById(id)) {
    //         await this.categoryRepository.delete({ id: id })
    //         return "Delete is successful"
    //     }
    //     throw new HttpException("The category not found", HttpStatus.NOT_FOUND);
    // }
}