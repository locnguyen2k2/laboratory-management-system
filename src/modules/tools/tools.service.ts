import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ToolsEntity } from "./tools.entity";
import { Repository } from "typeorm";
import { AddToolDto } from "./dtos/add-tool.enum";
import { UpdateToolDto } from "./dtos/update-tool.enum";
import { CategoryService } from "../categories/category.service";

@Injectable()
export class ToolsService {
    constructor(@InjectRepository(ToolsEntity) private readonly toolsRepository: Repository<ToolsEntity>,
        private readonly categoryService: CategoryService
    ) { }

    async findAll() {
        return this.toolsRepository
            .createQueryBuilder("item")
            .getMany();
    }

    async findById(id: number) {
        const item = await this.toolsRepository
            .createQueryBuilder("item")
            .where({ id: id })
            .getOne()
        return item ? item : new HttpException("The tool not found", HttpStatus.NOT_FOUND);
    }

    async findByName(name: string) {
        return (
            await this.toolsRepository
                .createQueryBuilder("item")
                .where('replace(item.name, \' \', \'\') LIKE :name',
                    { name: name.replace(/\s/g, "") })
                .getOne()
        )
    }

    async add(data: AddToolDto) {
        const tool = await this.findByName(data.name);
        if (tool) {
            throw new HttpException(`The tool is existed`, HttpStatus.BAD_REQUEST);
        }
        const category = await this.categoryService.findById(data.categoryId);
        delete data.categoryId;
        const newItem = await this.toolsRepository.save(new ToolsEntity({ ...data, category: category }));
        return newItem;
    }

    async update(id: number, data: UpdateToolDto) {
        const tool = await this.findById(id);
        if (tool) {
            const isExisted = await this.findByName(data.name);
            if (isExisted && isExisted.id !== id) {
                throw new HttpException(`The tool is existed`, HttpStatus.BAD_REQUEST);
            }
            await this.toolsRepository.update({ id: id }, new ToolsEntity({ ...data }))
            return await this.findById(id);
        }
        throw new HttpException(`The tool not found`, HttpStatus.NOT_FOUND);
    }
}