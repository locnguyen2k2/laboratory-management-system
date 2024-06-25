import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomItemEntity } from './room-item.entity';
import { Repository } from 'typeorm';
import { AddListRoomItemDto, AddRoomItemDto } from './dtos/add-roomItem.dto';
import { ItemService } from '../items/item.service';
import { RoomService } from '../rooms/room.service';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { isEmpty } from 'lodash';
import { TransferRoomItemDto } from './dtos/transfer-roomItem.dto';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { RoomItemDto } from './dtos/room-item.dto';
import { CategoryService } from '../categories/category.service';
import { UpdateRoomItemDto } from './dtos/update-room-item.dto';

const _ = require('lodash');

@Injectable()
export class RoomItemService {
  constructor(
    @InjectRepository(RoomItemEntity)
    private readonly roomItemRepository: Repository<RoomItemEntity>,
    private readonly roomService: RoomService,
    private readonly itemService: ItemService,
    private readonly categoryService: CategoryService,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<RoomItemDto>> {
    const roomItem = this.roomItemRepository.createQueryBuilder('roomItem');
    roomItem
      .leftJoinAndSelect('roomItem.item', 'item')
      .leftJoinAndSelect('roomItem.room', 'room')
      .select(['roomItem', 'item', 'item.category', 'room'])
      .orderBy('roomItem.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const numberRecords = await roomItem.getCount();
    const { entities } = await roomItem.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findItemsForStudent(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RoomItemDto>> {
    const roomItem = this.roomItemRepository.createQueryBuilder('roomItem');
    const items = await this.itemService.findByCategory(
      3,
      new PageOptionsDto(),
    );
    const itemsId = items.data.map((item) => item.id);
    itemsId.length > 0
      ? roomItem
          .leftJoinAndSelect('roomItem.item', 'item')
          .leftJoinAndSelect('roomItem.room', 'room')
          .select(['roomItem', 'item', 'room'])
          .andWhere('(item.id NOT IN (:...itemsId))', { itemsId })
          .orderBy('roomItem.createdAt', pageOptionsDto.order)
          .skip(pageOptionsDto.skip)
          .take(pageOptionsDto.take)
      : roomItem
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

  async findByCategory(
    categoryId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RoomItemDto>> {
    const roomItem = this.roomItemRepository.createQueryBuilder('roomItem');
    const items = await this.itemService.findByCategory(
      categoryId,
      new PageOptionsDto(),
    );
    const itemsId = items.data.map((item) => item.id);
    let numberRecords = 0;
    let entities = [];
    if (itemsId.length > 0) {
      roomItem
        .leftJoinAndSelect('roomItem.item', 'item')
        .leftJoinAndSelect('roomItem.room', 'room')
        .where('(item.id IN (:...itemsId))', { itemsId })
        .select(['roomItem', 'item', 'room'])
        .orderBy('roomItem.createdAt', pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take);

      numberRecords = await roomItem.getCount();
      entities = (await roomItem.getRawAndEntities()).entities;
    }

    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
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
      (roomItem.itemQuantityBorrowed - roomItem.itemQuantityReturned) >
      0
      ? roomItem.quantity -
          (roomItem.itemQuantityBorrowed - roomItem.itemQuantityReturned)
      : 0;
  }

  async getRoomItemByItemId(
    itemId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RoomItemDto>> {
    const roomItems =
      await this.roomItemRepository.createQueryBuilder('roomItem');

    roomItems
      .leftJoinAndSelect('roomItem.room', 'room')
      .leftJoinAndSelect('roomItem.item', 'item')
      .where('(item.id = :itemId)', { itemId })
      .select(['roomItem', 'item', 'room'])
      .orderBy('roomItem.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const numberRecords = await roomItems.getCount();
    const { entities } = await roomItems.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
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

  async isRoomHasItem(itemId: number, roomId: number): Promise<boolean> {
    const isResult = await this.roomItemRepository
      .createQueryBuilder('roomItem')
      .leftJoinAndSelect('roomItem.room', 'room')
      .leftJoinAndSelect('roomItem.item', 'item')
      .where('(item.id = :itemId AND room.id = :roomId)', { itemId, roomId })
      .getOne();
    return isResult ? true : false;
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
      itemQuantityReturned >= 0 &&
        (await this.roomItemRepository.update(
          { id: roomItem.id },
          { itemQuantityReturned },
        ));

      return await this.findById(id);
    }
  }

  async updateRoomItemQuantityBorrowed(
    id: number,
    itemQuantityBorrowed: number,
  ) {
    const roomItem = await this.findById(id);

    if (roomItem) {
      itemQuantityBorrowed >= 0 &&
        (await this.roomItemRepository.update(
          { id: roomItem.id },
          { itemQuantityBorrowed },
        ));

      return await this.findById(id);
    }
  }

  async updateRoomItemQuantity(id: number, quantity: number) {
    const roomItem = await this.findById(id);
    if (roomItem) {
      await this.roomItemRepository.update({ id }, { quantity });
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
      item = await this.itemService.updateItemHandover(
        data.itemId,
        item.handover + data.quantity,
      );

      if (await this.isRoomHasItem(data.itemId, data.roomId)) {
        const roomItem = await this.findByItemRoom(data.itemId, data.roomId);
        return await this.updateRoomItemQuantity(
          roomItem.id,
          roomItem.quantity + data.quantity,
        );
      } else {
        room = await this.roomService.updateRoomQuantity(
          data.roomId,
          room.quantity + 1,
        );

        delete data.itemId;
        delete data.roomId;

        const newItem = new RoomItemEntity({ ...data, room, item });
        await this.roomItemRepository.save(newItem);
        return newItem;
      }
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

  async updateRoomItem(id, data: UpdateRoomItemDto) {
    const roomItem = await this.findById(id);

    if (roomItem) {
      const availableQuantity = await this.itemService.getAvailableQuantity(
        roomItem.item.id,
      );

      if (availableQuantity + roomItem.quantity - data.quantity < 0) {
        throw new BusinessException(
          `400:The quantity must greater or euqal ${availableQuantity + roomItem.quantity}!`,
        );
      }
      if (!_.isNil(data.quantity)) {
        if (data.quantity < roomItem.itemQuantityBorrowed)
          throw new BusinessException(
            `400:The quantity must greater or euqal ${roomItem.itemQuantityBorrowed}!`,
          );

        data.quantity < roomItem.quantity
          ? await this.itemService.updateItemHandover(
              roomItem.item.id,
              roomItem.item.handover - (roomItem.quantity - data.quantity),
            )
          : await this.itemService.updateItemHandover(
              roomItem.item.id,
              roomItem.item.handover + (data.quantity - roomItem.quantity),
            );
      }

      const info = {
        ...(!_.isNil(data.status)
          ? { status: data.status }
          : { status: roomItem.status }),
        ...(!_.isNil(data.quantity) && { quantity: data.quantity }),
        ...(data.year ? { year: data.year } : { year: roomItem.year }),
        ...(data.remark
          ? { remark: data.remark }
          : { remark: roomItem.remark }),
        updateBy: data.updateBy,
      };

      await this.roomItemRepository.update(
        { id: id },
        {
          ...info,
        },
      );

      return await this.findById(id);
    }
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

        const item = await this.itemService.updateItemHandover(
          roomItem.itemId,
          roomItem.item.handover + roomItem.quantity,
        );

        if (await this.isRoomHasItem(roomItem.itemId, roomItem.roomId)) {
          const data = await this.findByItemRoom(
            roomItem.itemId,
            roomItem.roomId,
          );
          return await this.updateRoomItemQuantity(
            data.id,
            data.quantity + roomItem.quantity,
          );
        } else {
          const room = await this.roomService.updateRoomQuantity(
            roomItem.roomId,
            roomItem.room.quantity + 1,
          );

          delete roomItem.itemId;
          delete roomItem.roomId;

          const newItem = new RoomItemEntity({ ...data, room, item });
          await this.roomItemRepository.save(newItem);
        }
      }),
    );
    return await this.findAll(new PageOptionsDto());
  }

  async transferRoomItem(id: number, data: TransferRoomItemDto) {
    const roomItem = await this.findByItemRoom(data.itemId, id);

    if (roomItem) {
      const { itemId, roomId, quantity } = data;
      const roomHasItem = await this.isRoomHasItem(itemId, roomId);
      const availableItemQuantity = await this.getAvailableQuantity(
        roomItem.id,
      );
      const isExisted = roomHasItem
        ? await this.findByItemRoom(itemId, roomId)
        : null;

      delete data.itemId;
      delete data.roomId;

      if (isExisted && isExisted.id === roomItem.id)
        throw new BusinessException('400:Can not handover for this room item');

      if (availableItemQuantity - data.quantity < 0)
        throw new BusinessException(
          `400:The quantity handover of item must less than or equal ${availableItemQuantity}!`,
        );

      const item = await this.itemService.findById(itemId);
      const room = await this.roomService.findById(roomId);

      await this.updateRoomItemQuantity(
        roomItem.id,
        roomItem.quantity - data.quantity,
      );

      if (isExisted) {
        await this.updateRoomItemQuantity(
          isExisted.id,
          isExisted.quantity + data.quantity,
        );
      } else {
        await this.roomService.updateRoomQuantity(roomId, room.quantity + 1);
        const newItem = new RoomItemEntity({ ...data, room, item });

        newItem.createBy = newItem.updateBy = data.updateBy;
        await this.roomItemRepository.save(newItem);
      }

      return [
        {
          ...(await this.findByItemRoom(itemId, id)),
        },
        {
          ...(await this.findByItemRoom(itemId, roomId)),
        },
      ];
    }
  }

  async deleteById(id: number) {
    const isExisted = await this.findById(id);

    if (isExisted) {
      try {
        await this.roomItemRepository.delete(id);
        await this.roomService.updateRoomQuantity(
          isExisted.room.id,
          isExisted.room.quantity - 1,
        );

        await this.itemService.updateItemHandover(
          isExisted.item.id,
          isExisted.item.handover - isExisted.quantity,
        );

        return await this.findAll(new PageOptionsDto());
      } catch (error: any) {
        throw new BusinessException(ErrorEnum.ITEM_IN_USED);
      }
    }
  }
}
