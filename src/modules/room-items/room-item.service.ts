import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomItemEntity } from './room-item.entity';
import { Repository } from 'typeorm';
import { AddListRoomItemDto, AddRoomItemDto } from './dtos/add-roomItem.dto';
import { ItemService } from '../items/item.service';
import { RoomService } from '../rooms/room.service';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { isEmpty } from 'lodash';
import { UpdateRoomItemDto } from './dtos/update-roomItem.dto';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { RoomItemDto } from './dtos/room-item.dto';
import { ItemRegistrationService } from '../item-registration/item-registration.service';
import { RoomStatus } from '../rooms/room.constant';

@Injectable()
export class RoomItemService {
  constructor(
    @InjectRepository(RoomItemEntity)
    private readonly roomItemRepository: Repository<RoomItemEntity>,
    private readonly roomService: RoomService,
    private readonly itemService: ItemService,
    private readonly itemRegistrationService: ItemRegistrationService,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<RoomItemDto>> {
    const roomItem = this.roomItemRepository.createQueryBuilder('roomItem');
    roomItem
      .leftJoinAndSelect('roomItem.item', 'item')
      .leftJoinAndSelect('roomItem.room', 'room')
      .select(['roomItem', 'item', 'room'])
      .orderBy('roomItem.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const numberRecords = await roomItem.getCount();
    const { entities } = await roomItem.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findById(id: number) {
    const roomItem = await this.roomItemRepository
      .createQueryBuilder('roomItem')
      .leftJoinAndSelect('roomItem.item', 'item')
      .leftJoinAndSelect('roomItem.room', 'room')
      .where('(roomItem.id = :id)', { id })
      .select('roomItem')
      .select(['roomItem', 'item', 'room'])
      .getOne();
    if (roomItem) {
      return roomItem;
    }
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async findAllById(id: number) {
    const roomItem = await this.roomItemRepository
      .createQueryBuilder('roomItem')
      .leftJoinAndSelect('roomItem.item', 'item')
      .leftJoinAndSelect('roomItem.room', 'room')
      .where('(roomItem.id = :id)', { id })
      .select('roomItem')
      .select(['roomItem', 'item', 'room'])
      .getMany();
    return roomItem;
  }

  async getAvailableQuantity(id: number): Promise<number> {
    const roomItem = await this.findById(id);
    return roomItem.quantity -
      (roomItem.itemQuantityBorrowed + roomItem.itemQuantityReturned) >
      0
      ? roomItem.quantity -
          (roomItem.itemQuantityBorrowed + roomItem.itemQuantityReturned)
      : 0;
  }

  async roomsHasItem(itemId: number) {
    const quantity = await this.roomItemRepository
      .createQueryBuilder('roomItem')
      .where('(roomItem.item_id = :itemId)', {
        itemId,
      })
      .getCount();
    return quantity;
  }

  async findByRoomId(
    id: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RoomItemDto>> {
    const roomItem = this.roomItemRepository.createQueryBuilder('roomItem');

    roomItem
      .leftJoinAndSelect('roomItem.item', 'item')
      .leftJoinAndSelect('roomItem.room', 'room')
      .where('(roomItem.room_id = :id)', { id })
      .select(['roomItem', 'item', 'room'])
      .orderBy('roomItem.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const numberRecords = await roomItem.getCount();
    const { entities } = await roomItem.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async isRoomHasItem(roomid: number, itemid: number): Promise<boolean> {
    const isResult = await this.roomItemRepository
      .createQueryBuilder('roomItem')
      .where('(roomItem.room_id = :roomid AND roomItem.item_id = :itemid)', {
        roomid,
        itemid,
      })
      .getOne();
    return !isEmpty(isResult) ? true : false;
  }

  async findByItemRoom(itemId: number, roomId: number) {
    const roomItem = await this.roomItemRepository
      .createQueryBuilder('roomItem')
      .leftJoinAndSelect('roomItem.room', 'room')
      .leftJoinAndSelect('roomItem.item', 'item')
      .where('(item.id = :itemId AND room.id = :roomId)', { itemId, roomId })
      .getOne();
    if (roomItem) return roomItem;
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async updateRoomItemQuantityReturned(
    id: number,
    itemQuantityReturned: number,
  ) {
    const roomItem = await this.findById(id);

    if (roomItem) {
      await this.roomItemRepository.update(
        { id: roomItem.id },
        { itemQuantityReturned },
      );

      return await this.findById(id);
    }
  }

  async updateRoomItemQuantityBorrowed(
    id: number,
    itemQuantityBorrowed: number,
  ) {
    const roomItem = await this.findById(id);

    if (roomItem) {
      await this.roomItemRepository.update(
        { id: roomItem.id },
        { itemQuantityBorrowed },
      );

      return await this.findById(id);
    }
  }

  async addRoomItem(data: AddRoomItemDto) {
    let item = await this.itemService.findById(data.itemId);
    let room = await this.roomService.findById(data.roomId);

    const availableQuantity = await this.itemService.getAvailableQuantity(
      data.itemId,
    );

    if (availableQuantity - data.quantity < 0)
      throw new BusinessException('400:The quantity is not available!');

    if (item && room) {
      const roomHasItem = await this.isRoomHasItem(data.itemId, data.roomId);

      if (!roomHasItem) {
        await this.roomService.updateRoomQuantity(data.roomId, 1);

        room = await this.roomService.updateRoomStatus(
          data.roomId,
          RoomStatus.AVAILABLE,
        );

        item = await this.itemService.updateItemHandover(
          data.itemId,
          data.quantity,
        );
      }

      delete data.itemId;
      delete data.roomId;

      const newItem = new RoomItemEntity({ ...data, room, item });

      await this.roomItemRepository.save(newItem);

      return newItem;
    } else {
      throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
    }
  }

  async handleItems(items: RoomItemDto[]) {
    let listItem = [];
    items.map(async (item) => {
      if (isEmpty(listItem)) {
        listItem = [{ ...item }];
      } else {
        const index = listItem.findIndex(
          (value) =>
            value.itemId === item.item.id && value.roomId === item.room.id,
        );
        if (index !== -1 && item.quantity) {
          listItem[index].quantity += item.quantity;
        } else {
          listItem.push({ ...item });
        }
      }
    });
    if (listItem.length >= 1) return listItem;
  }

  async addListRoomItem(data: AddListRoomItemDto) {
    const listRoomItem = [];

    await Promise.all(
      data.room_items.map(async (item) => {
        const isExistItem = await this.itemService.findById(item.itemId);
        const isExistRoom = await this.roomService.findById(item.roomId);

        if (isExistItem && isExistRoom) {
          listRoomItem.push({
            ...item,
            item: isExistItem,
            room: isExistRoom,
          });
        }
      }),
    );

    const handleRoomItem = await this.handleItems(listRoomItem);

    if (!handleRoomItem) {
      throw new BusinessException('400:Nothing changes');
    }

    await Promise.all(
      handleRoomItem.map(async (roomItem) => {
        const availableQuantity = await this.itemService.getAvailableQuantity(
          roomItem.itemId,
        );

        if (availableQuantity - roomItem.quantity < 0)
          throw new BusinessException('400:The quantity is not available!');

        const roomHasItem = await this.isRoomHasItem(
          roomItem.itemId,
          roomItem.roomId,
        );

        if (!roomHasItem) {
          await this.roomService.updateRoomQuantity(roomItem.roomId, 1);
          roomItem.room = await this.roomService.updateRoomStatus(
            roomItem.roomId,
            RoomStatus.AVAILABLE,
          );

          roomItem.item = await this.itemService.updateItemHandover(
            roomItem.itemId,
            roomItem.quantity,
          );
        }

        delete roomItem.itemId;
        delete roomItem.roomId;

        const newRoomItem = new RoomItemEntity({
          ...roomItem,
          createBy: data.createBy,
          updateBy: data.updateBy,
        });

        await this.roomItemRepository.save(newRoomItem);
      }),
    );
    return handleRoomItem;
  }

  async updateRoomItem(id: number, data: UpdateRoomItemDto) {
    const roomItem = await this.findById(id);
    if (roomItem) {
      if (data.roomId || data.itemId) {
        const info = {
          ...(data.quantity
            ? { quantity: data.quantity }
            : { quantity: roomItem.quantity }),
          ...(data.year ? { year: data.year } : { year: roomItem.year }),
          ...(data.remark
            ? { remark: data.remark }
            : { remark: roomItem.remark }),
        };
        if (data.itemId) {
          if (!(await this.itemService.findById(data.itemId))) {
            throw new BusinessException('404:Item not found!');
          }
          const roomId = data.roomId ? data.roomId : roomItem.room.id;
          if (await this.isRoomHasItem(roomId, data.itemId)) {
            const isRoomItem = await this.findByItemRoom(roomId, data.itemId);
            if (isRoomItem?.id !== id) {
              throw new BusinessException('400:The room has this item!');
            }
            await this.roomItemRepository.update({ id }, { ...info });
            return await this.findByItemRoom(data.itemId, roomId);
          }
        }
        if (!(await this.roomService.findById(data?.roomId))) {
          throw new BusinessException('404:Room not found!');
        }
        const itemId = data?.itemId ? data.itemId : roomItem?.item.id;
        if (await this.isRoomHasItem(data.roomId, itemId)) {
          const isRoomItem = await this.findByItemRoom(data.roomId, itemId);
          if (isRoomItem?.id !== id) {
            throw new BusinessException('400:The room has this item!');
          }
          await this.roomItemRepository.update({ id }, { ...info });
          return this.findByItemRoom(itemId, data.roomId);
        }
      }
      const info = {
        ...(data.roomId
          ? { roomId: data.roomId }
          : { roomId: roomItem.room.id }),
        ...(data.itemId
          ? { itemId: data.itemId }
          : { itemId: roomItem.item.id }),
        ...(data.status
          ? { item_status: data.status }
          : { status: roomItem.status }),
        ...(data.quantity && data.quantity > 0
          ? { quantity: data.quantity }
          : { quantity: roomItem.quantity }),
        ...(data.year ? { year: data.year } : { year: roomItem.year }),
        ...(data.remark
          ? { remark: data.remark }
          : { remark: roomItem.remark }),
      };
      const room = await this.roomService.findById(info.roomId);
      const item = await this.itemService.findById(info.itemId);
      roomItem.updateBy = data.updateBy;
      await this.roomItemRepository.save({ ...roomItem, room, item });
      await this.roomItemRepository.update(
        { id: id },
        {
          year: info.year,
          quantity: info.quantity,
          remark: info.remark,
        },
      );
      return await this.findById(id);
    }
  }

  async deleteById(id: number) {
    const isExisted = await this.findById(id);

    if (isExisted) {
      const isBorrowed = await this.itemRegistrationService.findByRoomIdItemId(
        isExisted.room.id,
        isExisted.item.id,
      );

      if (isBorrowed.length === 0) {
        await this.roomService.updateRoomQuantity(isExisted.room.id, -1);

        await this.itemService.updateItemHandover(
          isExisted.item.id,
          -isExisted.quantity,
        );

        await this.roomItemRepository.delete(id);

        return await this.findAll(new PageOptionsDto());
      }

      throw new BusinessException(ErrorEnum.ITEM_IN_USED);
    }
  }
}
