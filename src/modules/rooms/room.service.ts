import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomEntity } from "./room.entity";
import { Repository } from "typeorm";
import { UpdateRoomDto } from "./dtos/update-room.dto";
import { AddRoomDto } from "./dtos/add-room.dto";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { ErrorEnum } from "src/constants/error-code.constant";
import { RoomDto } from "./dtos/room.dto";
import { PageMetaDto } from "src/common/dtos/page-meta.dto";
import { PageOptionsDto } from "src/common/dtos/page-options.dto";
import { PageDto } from "src/common/dtos/page.dto";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity) private readonly roomRepository: Repository<RoomEntity>,
    ) { }

    async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<RoomDto>> {
        let items = this.roomRepository.createQueryBuilder("item")
        items
            .orderBy("item.createdAt", pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
        const numberRecords = await items.getCount()
        const { entities } = await items.getRawAndEntities();
        const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
        return new PageDto(entities, pageMetaDto)
    }

    async findById(id: number) {
        const item = await this.roomRepository
            .createQueryBuilder("item")
            .where({ id: id })
            .getOne()
        if (item)
            return item;
        throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND)
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
            const info = {
                ...data,
                ...(data.name ? { name: data.name } : { name: room.name }),
                ...(data.remark ? { remark: data.remark } : { remark: room.remark }),
                ...(data.status ? { status: data.status } : { status: room.status })
            }
            await this.roomRepository.update({ id: id }, { ...info })
            return await this.findById(id);
        }
    }
}