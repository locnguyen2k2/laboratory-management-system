import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ItemStatusEntity } from "./item-status.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AddItemStatusDto } from "./dtos/add-itemStatus.dto";
import { UpdateItemStatusDto } from "./dtos/update-itemStatus.dto";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";

@Injectable()
export class ItemStatusService {
    constructor(
        @InjectRepository(ItemStatusEntity) private readonly itemStatusRepository: Repository<ItemStatusEntity>,
    ) { }

    async findAll() {
        return this.itemStatusRepository.find();
    }

    async findById(id: number) {
        const item = (await this.itemStatusRepository.find({ where: { id: id } }))[0];
        if (item)
            return item
    }

    async findByName(name: string) {
        return (
            await this.itemStatusRepository
                .createQueryBuilder("item")
                .where('replace(item.name, \' \', \'\') LIKE :name',
                    { name: name.replace(/\s/g, "") })
                .getOne()
        )
    }

    async add(data: AddItemStatusDto) {
        const isExisted = await this.findByName(data.name);
        if (isExisted) {
            throw new HttpException("The status is existed", HttpStatus.BAD_REQUEST);
        }
        const newItemStatus = new ItemStatusEntity(data)
        await this.itemStatusRepository.save(newItemStatus);
        return await this.findByName(data.name);
    }

    async update(id: number, data: UpdateItemStatusDto) {
        const itemStatus = await this.findById(id);
        const isExisted = await this.findByName(data.name)
        if (isExisted && isExisted.id !== id) {
            throw new BusinessException(ErrorEnum.RECORD_IS_EXISTED)
        }
        if (itemStatus) {
            await this.itemStatusRepository.update({ id: id }, { name: data.name })
            return "The status is updated successfully!";
        }
        throw new HttpException("The status not found", HttpStatus.NOT_FOUND);
    }
}