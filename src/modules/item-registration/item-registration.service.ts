import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemRegistrationEntity } from './item-registration.entity';
import { Repository } from 'typeorm';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { IAddItemRegistration } from './interfaces/add-registration.interface';
import { ItemService } from 'src/modules/items/item.service';
import { UpdateItemRegistrationDto } from './dtos/update-borrowing.dto';
import { RoomItemService } from '../room-items/room-item.service';
const _ = require('lodash');

@Injectable()
export class ItemRegistrationService {
  constructor(
    @InjectRepository(ItemRegistrationEntity)
    private readonly itemRegistrationRepository: Repository<ItemRegistrationEntity>,
    private readonly itemService: ItemService,
    private readonly roomItemService: RoomItemService,
  ) {}

  async itemRegHasInReg(regId: number, itemRegId: number) {
    const itemReg = await this.itemRegistrationRepository
      .createQueryBuilder('itemRegistration')
      .leftJoinAndSelect('itemRegistration.registration', 'registration')
      .select(['itemRegistration', 'registration'])
      .where('itemRegistration.id = :regId AND registration.id = :itemRegId', {
        regId,
        itemRegId,
      })
      .getOne();
    if (itemReg) return itemReg;
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async findByRoomItemId(roomItemId: number) {
    const registration = await this.itemRegistrationRepository
      .createQueryBuilder('itemReg')
      .leftJoinAndSelect('itemReg.roomItem', 'roomItem')
      .select([
        'itemReg.status',
        'itemReg.start_day',
        'itemReg.end_day',
        'itemReg.id',
        'itemReg.quantity',
        'itemReg.quantityReturned',
        'roomItem',
      ])
      .where('itemReg.roomItem = :roomItemId', { roomItemId })
      .getMany();
    return registration;
  }

  async findByRegistrationId(regid: number) {
    const itemReg = await this.itemRegistrationRepository
      .createQueryBuilder('itemReg')
      .where('itemReg.registration_id = :registrationId', {
        registrationId: regid,
      })
      .leftJoinAndSelect('itemReg.roomItem', 'roomItem')
      .select([
        'itemReg.status',
        'itemReg.itemStatus',
        'itemReg.start_day',
        'itemReg.end_day',
        'itemReg.id',
        'itemReg.quantity',
        'itemReg.quantityReturned',
        'roomItem',
      ])
      .getMany();
    if (itemReg) return itemReg;
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async findByUserDayItem(
    startDay: number,
    endDay: number,
    roomItemId: number,
    uid: number,
  ) {
    const itemReg = await this.itemRegistrationRepository
      .createQueryBuilder('itemReg')
      .leftJoinAndSelect('itemReg.roomItem', 'roomItem')
      .leftJoinAndSelect('itemReg.registration', 'registration')
      .where(
        '(itemReg.start_day <= :startDay AND itemReg.end_day >= :startDay AND itemReg.start_day <= :endDay AND roomItem.id = :roomItemId AND itemReg.createBy = :uid)',
        { startDay, endDay, roomItemId, uid },
      )
      .select([
        'registration.id' as 'registrationId',
        'itemReg.status',
        'itemReg.itemStatus',
        'itemReg.start_day',
        'itemReg.quantity',
        'itemReg.quantityReturned',
        'itemReg.end_day',
        'itemReg.id',
        'roomItem',
      ])
      .getOne();
    if (itemReg) return itemReg;
  }

  async findByUidRegid(uid: number, id: number) {
    const itemReg = await this.itemRegistrationRepository
      .createQueryBuilder('itemReg')
      .leftJoinAndSelect('itemReg.roomItem', 'roomItem')
      .leftJoinAndSelect('itemReg.registration', 'registration')
      .where('(itemReg.createBy = :uid AND itemReg.id = :id)', { uid, id })
      .select([
        'registration.id' as 'registrationId',
        'itemReg.status',
        'itemReg.itemStatus',
        'itemReg.start_day',
        'itemReg.quantity',
        'itemReg.quantityReturned',
        'itemReg.end_day',
        'itemReg.id',
        'roomItem',
      ])
      .getOne();
    if (itemReg) return itemReg;
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async findById(id: number) {
    const itemReg = await this.itemRegistrationRepository
      .createQueryBuilder('itemReg')
      .leftJoinAndSelect('itemReg.roomItem', 'roomItem')
      .leftJoinAndSelect('itemReg.registration', 'registration')
      .where('(itemReg.id = :id)', { id })
      .select([
        'registration.id' as 'registrationId',
        'itemReg.quantityReturned',
        'itemReg.status',
        'itemReg.itemStatus',
        'itemReg.start_day',
        'itemReg.quantity',
        'itemReg.end_day',
        'itemReg.id',
        'roomItem',
      ])
      .getOne();
    if (itemReg) return itemReg;
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async addItemReg(data: IAddItemRegistration) {
    let isReplace = false;

    const roomItem = await this.roomItemService.findById(data.roomItemId);

    if (roomItem) {
      const itemReg = await this.findByUserDayItem(
        data.start_day,
        data.end_day,
        data.roomItemId,
        data.user,
      );

      if (itemReg) {
        isReplace = true;
        data.quantity += itemReg.quantity;
        await this.itemRegistrationRepository.update(
          { id: itemReg.id },
          {
            updatedAt: data.registration.createdAt,
            end_day: data.end_day,
            quantity: data.quantity,
            itemStatus: data.itemStatus,
          },
        );
        return itemReg.registration.id;
      }
      if (!isReplace) {
        delete data.roomItemId;
        delete data.user;
        const newItem = new ItemRegistrationEntity({ ...data, roomItem });
        await this.itemRegistrationRepository.save(newItem);
        return data.registration.id;
      }
    }
  }

  async update(id: number, uid: number, data: UpdateItemRegistrationDto) {
    const isExisted = await this.findByUidRegid(uid, id);

    if (isExisted) {
      const roomItem = !_.isNil(data.items.roomItemId)
        ? await this.roomItemService.findById(data.items.roomItemId)
        : isExisted.roomItem;
      await this.itemRegistrationRepository.update(
        { id },
        {
          roomItem,
          quantity: data.items.quantity,
          status: data.items.status,
          itemStatus: data.items.itemStatus,
          end_day: data.end_day === 0 ? isExisted.end_day : data.end_day,
          updateBy: uid,
        },
      );
      return await this.findByUidRegid(uid, id);
    }
  }

  async updateQuantityReturned(id: number, quantity: number) {
    if (await this.findById(id)) {
      await this.itemRegistrationRepository.update(
        { id },
        {
          quantityReturned: quantity,
        },
      );
      return await this.findById(id);
    }
  }
}
