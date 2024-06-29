import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemReturningEntity } from './entities/item-returning.entity';
import { PageDto } from '../../common/dtos/page.dto';
import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { ItemReturningDto } from './dtos/item-returning.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { AddItemReturningDto } from './dtos/add-item-returning.dto';
import { BusinessException } from '../../common/exceptions/biz.exception';
import { ErrorEnum } from '../../constants/error-code.constant';
import { ItemRegistrationService } from '../item-registration/item-registration.service';
import { UserService } from '../user/user.service';
import { RoomItemService } from '../room-items/room-item.service';
import { RegistrationService } from '../registration/registration.service';
import { ItemRegistrationStatus } from '../item-registration/item-registration.constant';
import {
  AddListReturningDto,
  ReturningDto,
} from './dtos/add-list-returning.dto';
import { isEmpty } from 'lodash';
import { ItemService } from '../items/item.service';
import { CategoryEnum } from '../categories/category.constant';

const _ = require('lodash');

@Injectable()
export class ItemReturningService {
  constructor(
    @InjectRepository(ItemReturningEntity)
    private readonly itemReturningRepository: Repository<ItemReturningEntity>,
    private readonly itemRegistrationService: ItemRegistrationService,
    private readonly registrationService: RegistrationService,
    private readonly userService: UserService,
    private readonly roomItemService: RoomItemService,
    private readonly itemService: ItemService,
  ) {}

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ItemReturningDto>> {
    const items =
      this.itemReturningRepository.createQueryBuilder('itemReturning');

    items
      .leftJoinAndSelect('itemReturning.user', 'user')
      .select(['itemReturning', 'user.id'])
      .orderBy('itemReturning.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const numberRecords = await items.getCount();
    const { entities } = await items.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findById(id: number) {
    const itemReturning = await this.itemReturningRepository
      .createQueryBuilder('itemReturning')
      .leftJoinAndSelect('itemReturning.user', 'user')
      .leftJoinAndSelect('itemReturning.registration', 'registration')
      .leftJoinAndSelect('itemReturning.itemRegistration', 'itemRegistration')
      .select(['itemReturning', 'user', 'registration', 'itemRegistration'])
      .where({ id })
      .getOne();
    if (itemReturning) {
      return itemReturning;
    }
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async findByIdUid(id: number, uid: number) {
    const itemReturning = await this.itemReturningRepository
      .createQueryBuilder('itemReturning')
      .leftJoinAndSelect('itemReturning.user', 'user')
      .leftJoinAndSelect('itemReturning.registration', 'registration')
      .leftJoinAndSelect('itemReturning.itemRegistration', 'itemRegistration')
      .select(['itemReturning', 'user', 'registration', 'itemRegistration'])
      .where('(itemReturning.id = :id AND user.id = :uid)', { id, uid })
      .getOne();
    if (itemReturning) {
      return itemReturning;
    }
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async findByUid(uid: number, pageOptionsDto: PageOptionsDto) {
    const items =
      this.itemReturningRepository.createQueryBuilder('itemReturning');

    items
      .leftJoinAndSelect('itemReturning.user', 'user')
      .select(['itemReturning', 'user.id'])
      .where('(user.id = :uid)', { uid })
      .orderBy('itemReturning.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const numberRecords = await items.getCount();
    const { entities } = await items.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async add(data: AddItemReturningDto) {
    const regHasItemReg = await this.itemRegistrationService.itemRegHasInReg(
      data.registrationId,
      data.itemRegistrationId,
    );

    if (regHasItemReg) {
      const user = await this.userService.findById(data.uid);

      const itemRegistration = await this.itemRegistrationService.findById(
        data.itemRegistrationId,
      );

      const registration = await this.registrationService.findById(
        data.registrationId,
      );

      if (
        itemRegistration.quantityReturned + data.quantity <=
        itemRegistration.quantity
      ) {
        const roomItem = await this.roomItemService.findById(
          itemRegistration.roomItem.id,
        );

        const item = await this.itemService.findById(roomItem.item.id);
        if (item.category.id === CategoryEnum.CHEMICALS) {
          if (_.isNil(data.remaining_volume)) {
            throw new BusinessException(
              '400:Remaining volume is require for chemical item!',
            );
          }
          const remainingVolume = data.remaining_volume / item.volume;
          if (
            data.quantity >= remainingVolume &&
            remainingVolume > data.quantity - 1
          ) {
            if (item.volume * data.quantity > data.remaining_volume) {
              await this.roomItemService.updateRoomItemRemainingVolume(
                roomItem.id,
                roomItem.remaining_volume + data.remaining_volume,
              );
            }
          } else {
            throw new BusinessException(
              '400:The quantity or volume is invalid!',
            );
          }
        } else {
          delete data.remaining_volume;
        }

        await this.roomItemService.updateRoomItemQuantityReturned(
          roomItem.id,
          roomItem.itemQuantityReturned + data.quantity,
        );

        await this.itemRegistrationService.updateQuantityReturned(
          data.itemRegistrationId,
          data.quantity + itemRegistration.quantityReturned,
        );

        await this.itemRegistrationService.updateStatus(
          itemRegistration.id,
          data.createBy,
          ItemRegistrationStatus.RETURNED,
        );

        const newItem = new ItemReturningEntity({
          ...data,
          itemRegistration,
          registration,
          user,
        });
        await this.itemReturningRepository.save(newItem);

        return newItem;
      }
      throw new BusinessException('400:The quantity invalid!');
    }
  }

  async addList(data: AddListReturningDto) {
    let listItem: ReturningDto[] = [];

    await Promise.all(
      data.items.map(async (item: ReturningDto) => {
        if (
          await this.itemRegistrationService.itemRegHasInReg(
            item.registrationId,
            item.itemRegistrationId,
          )
        ) {
          if (isEmpty(listItem)) {
            listItem = [{ ...item }];
          } else {
            const index = listItem.findIndex(
              (value) =>
                value.itemRegistrationId === item.itemRegistrationId &&
                item.registrationId === value.registrationId,
            );
            if (index === -1) {
              listItem.push({ ...item });
            } else {
              listItem[index].quantity += item.quantity;
            }
          }
        }
      }),
    );

    if (listItem.length > 0) {
      const listNewItem = [];
      await Promise.all(
        listItem.map(async (item) => {
          const regHasItemReg =
            await this.itemRegistrationService.itemRegHasInReg(
              item.registrationId,
              item.itemRegistrationId,
            );
          if (regHasItemReg) {
            const user = await this.userService.findById(data.uid);

            const itemRegistration =
              await this.itemRegistrationService.findById(
                item.itemRegistrationId,
              );

            const registration = await this.registrationService.findById(
              item.registrationId,
            );

            if (
              itemRegistration.quantityReturned + item.quantity <=
              itemRegistration.quantity
            ) {
              const roomItem = await this.roomItemService.findById(
                itemRegistration.roomItem.id,
              );

              const itemEntity = await this.itemService.findById(
                roomItem.item.id,
              );
              if (itemEntity.category.id === CategoryEnum.CHEMICALS) {
                if (_.isNil(item.remaining_volume)) {
                  throw new BusinessException(
                    '400:Remaining volume is require for chemical item!',
                  );
                }
                if (item.remaining_volume !== 0) {
                  const remainingVolume =
                    item.remaining_volume / itemEntity.volume;
                  if (
                    item.quantity >= remainingVolume &&
                    remainingVolume > item.quantity - 1
                  ) {
                    if (
                      itemEntity.volume * item.quantity >
                      item.remaining_volume
                    ) {
                      await this.roomItemService.updateRoomItemRemainingVolume(
                        roomItem.id,
                        roomItem.remaining_volume + item.remaining_volume,
                      );
                    }
                  } else {
                    throw new BusinessException(
                      '400:The quantity or volume is invalid!',
                    );
                  }
                }
              } else {
                delete item.remaining_volume;
              }

              await this.roomItemService.updateRoomItemQuantityReturned(
                roomItem.id,
                roomItem.itemQuantityReturned + item.quantity,
              );

              await this.itemRegistrationService.updateQuantityReturned(
                item.itemRegistrationId,
                item.quantity + itemRegistration.quantityReturned,
              );

              await this.itemRegistrationService.updateStatus(
                itemRegistration.id,
                data.createBy,
                ItemRegistrationStatus.RETURNED,
              );

              const newItem = new ItemReturningEntity({
                createBy: data.createBy,
                updateBy: data.createBy,
                itemStatus: item.itemStatus,
                status: data.status,
                quantity: item.quantity,
                date_returning: data.date_returning,
                remark: item.remark,
                remaining_volume: item.remaining_volume,
                itemRegistration,
                registration,
                user,
              });
              await this.itemReturningRepository.save(newItem);

              listNewItem.push(newItem);
            } else {
              throw new BusinessException('400:The quantity invalid!');
            }
          }
        }),
      );
      return listNewItem;
    }
    throw new BusinessException('200:Nothing changes!');
  }

  async update() {}

  async delete() {}
}
