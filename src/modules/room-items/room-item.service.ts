import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomItemEntity } from "./room-item.entity";
import { Repository } from "typeorm";
import { AddRoomItemDto } from "./dtos/add-roomItem.dto";
import { ItemStatusService } from "../item-status/item-status.service";
import { ItemService } from "../items/item.service";
import { RoomService } from "../rooms/room.service";
import { BusinessException } from "src/common/exceptions/biz.exception";
import { isEmpty } from "lodash";
import { UpdateRoomItemDto } from "./dtos/update-roomItem.dto";

@Injectable()
export class RoomItemService {
    constructor(
        @InjectRepository(RoomItemEntity) private readonly roomItemRepository: Repository<RoomItemEntity>,
        private readonly itemStatusService: ItemStatusService,
        private readonly roomService: RoomService,
        private readonly itemService: ItemService,
    ) { }

    async findById(id: number) {
        const roomItem = await this.roomItemRepository.createQueryBuilder('roomItem')
            .leftJoinAndSelect('roomItem.item', 'item')
            .leftJoinAndSelect('roomItem.room', 'room')
            .leftJoinAndSelect('roomItem.item_status', 'itemStatus')
            .leftJoinAndSelect('item.unit', 'unit')
            .where('(roomItem.id = :id)', { id })
            .select('roomItem')
            .select(['roomItem', 'item', 'room', 'itemStatus', 'unit'])
            .getOne()
        if (roomItem) {
            return roomItem
        }
    }

    async findByRoomId(id: number) {
        const roomItem = await this.roomItemRepository.createQueryBuilder('roomItem')
            .leftJoinAndSelect('roomItem.item', 'item')
            .leftJoinAndSelect('roomItem.item_status', 'itemStatus')
            .leftJoinAndSelect('item.unit', 'unit')
            .where('(roomItem.room_id = :id)', { id })
            .select(['roomItem.id', 'item.name', 'item.specification', 'unit.name', 'roomItem.quantity', 'item.origin', 'roomItem.year', 'item.id', 'itemStatus.name', 'roomItem.remark'])
            .getMany()
        if (roomItem) {
            const room = await this.roomService.findById(id)
            return { id: room.id, name: room.name, roomItem }
        }
    }

    async isRoomHasItem(roomid: number, itemid: number): Promise<Boolean> {
        const isResult = await this.roomItemRepository.createQueryBuilder('roomItem')
            .where('(roomItem.room_id = :roomid AND roomItem.item_id = :itemid)', { roomid, itemid })
            .getOne()
        return !isEmpty(isResult) ? true : false
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
        const item_status = await this.itemStatusService.findById(data.item_status);
        const item = await this.itemService.findById(data.itemId);
        const room = await this.roomService.findById(data.roomId);
        delete data.item_status;
        delete data.itemId;
        delete data.roomId;
        if (item && room && item_status) {
            const newItem = new RoomItemEntity({ ...data, room, item, item_status })
            await this.roomItemRepository.save(newItem);
            return newItem;
        } else {
            throw new BusinessException('404:Item or room not found!')
        }
    }

    async updateRoomItem(id: number, data: UpdateRoomItemDto) {
        const roomItem = await this.findById(id)
        if (!roomItem) {
            throw new BusinessException('404:Room item not found!')
        }

        if (data.roomId) {
            if (!(await this.roomService.findById(data.roomId))) {
                throw new BusinessException('404:Room not found!')
            }
            const itemId = data.itemId ? data.itemId : roomItem.item.id;
            if (await this.isRoomHasItem(data.roomId, itemId)) {
                throw new BusinessException("400:The room has this item!")
            }
        }
        if (data.itemId) {
            if (!(await this.itemService.findById(data.itemId))) {
                throw new BusinessException('404:Item not found!')
            }
            const roomId = data.roomId ? data.roomId : roomItem.room.id;
            if (await this.isRoomHasItem(roomId, data.itemId)) {
                throw new BusinessException("400:The room has this item!")
            }
        }
        if (data.item_status && !(await this.itemStatusService.findById(data.item_status))) {
            throw new BusinessException('404:Status not found!')
        }
        let info = {
            ...(data.roomId ? { roomId: data.roomId } : { roomId: roomItem.room.id }),
            ...(data.itemId ? { itemId: data.itemId } : { itemId: roomItem.item.id }),
            ...(data.item_status ? { item_status: data.item_status } : { item_status: roomItem.item_status.id }),
            ...((data.quantity && data.quantity > 0) ? { quantity: data.quantity } : { quantity: roomItem.quantity }),
            ...(data.year ? { year: data.year } : { year: roomItem.year }),
            ...(data.remark ? { remark: data.remark } : { remark: roomItem.remark }),
        }
        const room = await this.roomService.findById(info.roomId)
        const item = await this.itemService.findById(info.itemId)
        const itemStatus = await this.itemStatusService.findById(info.item_status)
        roomItem.updateBy = data.updateBy
        await this.roomItemRepository.save({ ...roomItem, room, item, itemStatus })
        await this.roomItemRepository.update({ id: id }, { year: info.year, quantity: info.quantity, remark: info.remark })
        return await this.findById(id)
    }
}