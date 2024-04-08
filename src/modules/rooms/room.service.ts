import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomEntity } from "./room.entity";
import { Repository } from "typeorm";
import { UpdateRoomDto } from "./dtos/update-room.dto";
import { AddRoomDto } from "./dtos/add-room.dto";
import { CategoryService } from "../categories/category.service";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity) private readonly roomRepository: Repository<RoomEntity>,
    ) { }

    async findAll() {
        return this.roomRepository
            .createQueryBuilder("item")
            .leftJoinAndSelect('item.category', 'category')
            .select(['item'])
            .getMany();
    }

    async findById(id: number) {
        const item = await this.roomRepository
            .createQueryBuilder("item")
            .where({ id: id })
            .getOne()
        if (item)
            return item;
    }

    async findByName(name: string) {
        return (
            await this.roomRepository
                .createQueryBuilder("item")
                .where('replace(item.name, \' \', \'\') LIKE :name',
                    { name: name.replace(/\s/g, "") })
                .getOne()
        )
    }

    async add(data: AddRoomDto) {
        const room = await this.findByName(data.name);
        if (room) {
            throw new HttpException(`The room is existed`, HttpStatus.BAD_REQUEST);
        }
        const newItem = await this.roomRepository.save(new RoomEntity({ ...data }));
        return newItem;
    }

    async update(id: number, data: UpdateRoomDto) {
        const room = await this.findById(id);
        if (room) {
            const isExisted = await this.findByName(data.name);
            if (isExisted && isExisted.id !== id) {
                throw new HttpException(`The room is existed`, HttpStatus.BAD_REQUEST);
            }
            await this.roomRepository.update({ id: id }, new RoomEntity({ ...data }))
            return await this.findById(id);
        }
        throw new HttpException(`The room not found`, HttpStatus.NOT_FOUND);
    }
}