import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomItemEntity } from "./room_item.entity";
import { Repository } from "typeorm";
import { AddRoomItemDto } from "./dtos/add-room_item.dto";
import { HandoverStatusService } from "../handover_status/handover_status.service";
import { ItemService } from "../items/item.service";
import { RoomService } from "../rooms/room.service";
import { BusinessException } from "src/common/exceptions/biz.exception";

@Injectable()
export class RoomItemService {
    constructor(
        @InjectRepository(RoomItemEntity) private readonly roomItemRepository: Repository<RoomItemEntity>,
        private readonly handoverStatusService: HandoverStatusService,
        private readonly roomService: RoomService,
        private readonly itemService: ItemService,
    ) { }

    async findByRoomId(id: number) {
        const roomItem = await this.roomItemRepository.createQueryBuilder('roomItem')
            .leftJoinAndSelect('roomItem.item', 'item')
            .leftJoinAndSelect('roomItem.handover_status', 'handoverStatus')
            .leftJoinAndSelect('item.unit', 'unit')
            .where('(roomItem.room_id = :id)', { id })
            .select(['roomItem.id', 'item.name', 'item.specification', 'unit.name', 'roomItem.quantity', 'item.origin', 'roomItem.year', 'item.id', 'handoverStatus.name', 'roomItem.remark'])
            .getMany()
        if (roomItem) {
            const room = await this.roomService.findById(id)
            return { id: room.id, name: room.name, roomItem }
        }
    }

    async findByItemRoom(itemId: number, roomId: number) {
        const roomItem = await this.roomItemRepository.createQueryBuilder('roomItem')
            .leftJoinAndSelect('roomItem.room', 'room')
            .leftJoinAndSelect('roomItem.item', 'item')
            .where('(item.id = :itemId AND room.id = :roomId)', { itemId, roomId })
            .getOne()
        if (roomItem)
            return roomItem
    }

    async addRoomItem(data: AddRoomItemDto) {
        const roomItem = await this.findByItemRoom(data.itemId, data.roomId);
        if (roomItem) {
            await this.roomItemRepository.update({ id: roomItem.id }, { quantity: (roomItem.quantity + data.quantity) })
            return data;
        }
        const handover_status = await this.handoverStatusService.findById(data.handover_statusId);
        const item = await this.itemService.findById(data.itemId);
        const room = await this.roomService.findById(data.roomId);
        delete data.handover_statusId;
        delete data.itemId;
        delete data.roomId;
        if (item && room && handover_status) {
            const newItem = new RoomItemEntity({ ...data, room, item, handover_status })
            await this.roomItemRepository.save(newItem);
            return newItem;
        } else {
            throw new BusinessException('404:Item or room not found!')
        }
    }
}