import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChemicalsEntity } from "./chemicals.entity";
import { Repository } from "typeorm";
import { UpdateChemicalDto } from "./dtos/update-chemicals.dto";
import { AddChemicalDto } from "./dtos/add-chemicals.dto";

@Injectable()
export class ChemicalsService {
    constructor(
        @InjectRepository(ChemicalsEntity) private readonly chemicalRepository: Repository<ChemicalsEntity>
    ) { }

    async findAll() {
        return this.chemicalRepository
            .createQueryBuilder("item")
            .getMany();
    }

    async findById(id: number) {
        const item = await this.chemicalRepository
            .createQueryBuilder("item")
            .where({ id: id })
            .getOne()
        return item ? item : new HttpException("The chemical not found", HttpStatus.NOT_FOUND);
    }

    async findByName(name: string) {
        return (
            await this.chemicalRepository
                .createQueryBuilder("item")
                .where('replace(item.name, \' \', \'\') LIKE :name',
                    { name: name.replace(/\s/g, "") })
                .getOne()
        )
    }

    async add(data: AddChemicalDto) {
        const chemical = await this.findByName(data.name);
        if (chemical) {
            throw new HttpException(`The chemical is existed`, HttpStatus.BAD_REQUEST);
        }
        const newItem = await this.chemicalRepository.save(new ChemicalsEntity({ ...data }));
        return newItem;
    }

    async update(id: number, data: UpdateChemicalDto) {
        const chemical = await this.findById(id);
        if (chemical) {
            const isExisted = await this.findByName(data.name);
            if (isExisted && isExisted.id !== id) {
                throw new HttpException(`The chemical is existed`, HttpStatus.BAD_REQUEST);
            }
            await this.chemicalRepository.update({ id: id }, new ChemicalsEntity({ ...data }))
            return await this.findById(id);
        }
        throw new HttpException(`The chemical not found`, HttpStatus.NOT_FOUND);
    }
}