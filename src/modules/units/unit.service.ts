import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UnitEntity } from "./unit.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AddUnitDto } from "./dtos/add-unit.dto";
import { UpdateUnitDto } from "./dtos/update.dto";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";

@Injectable()
export class UnitService {
    constructor(
        @InjectRepository(UnitEntity) private readonly unitRepository: Repository<UnitEntity>,
    ) { }

    async findAll() {
        return this.unitRepository.find();
    }

    async findById(id: number) {
        return (await this.unitRepository.find({ where: { id: id } }))[0];
    }

    async findByName(name: string) {
        return (
            await this.unitRepository
                .createQueryBuilder("item")
                .where('replace(item.name, \' \', \'\') LIKE :name',
                    { name: name.replace(/\s/g, "") })
                .getOne()
        )
    }

    async add(data: AddUnitDto) {
        const isExisted = await this.findByName(data.name);
        if (isExisted) {
            throw new HttpException("The unit is existed", HttpStatus.BAD_REQUEST);
        }
        const newUnit = new UnitEntity(data)
        await this.unitRepository.save(newUnit);
        return await this.findByName(data.name);
    }

    async update(id: number, data: UpdateUnitDto) {
        const unit = await this.findById(id);
        const isExisted = await this.findByName(data.name)
        if (isExisted && isExisted.id !== id) {
            throw new BusinessException(ErrorEnum.RECORD_IS_EXISTED)
        }
        if (unit) {
            await this.unitRepository.update({ id: id }, { name: data.name })
            return "The unit is updated successfully!";
        }
        throw new HttpException("The unit not found", HttpStatus.NOT_FOUND);
    }
}