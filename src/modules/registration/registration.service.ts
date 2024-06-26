import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationEntity } from './registration.entity';
import { Repository } from 'typeorm';
import { AddItemRegistrationDto } from './../item-registration/dtos/add-registration.dto';
import { UserService } from '../user/user.service';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { ItemRegistrationService } from './../item-registration/item-registration.service';
import {
  ItemRegistration,
  RegistrationFilterDto,
} from './registration.constant';
import { isEmpty } from 'lodash';
import { RoomService } from '../rooms/room.service';
import { RoomItemService } from '../room-items/room-item.service';
import { UpdateItemRegistrationDto } from '../item-registration/dtos/update-borrowing.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { RegistrationDto, UpdateRegStatusDto } from './dtos/registration.dto';

const _ = require('lodash');

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(RegistrationEntity)
    private readonly registrationRepository: Repository<RegistrationEntity>,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly itemRegistrationServce: ItemRegistrationService,
    private readonly roomItemService: RoomItemService,
  ) {}

  async findByUser(uid: number, pageOptionsDto: PageOptionsDto) {
    const registration =
      this.registrationRepository.createQueryBuilder('registration');

    registration
      .leftJoinAndSelect('registration.user', 'user')
      .select(['registration', 'user.id'])
      .where('user.id = :uid', { uid })
      .orderBy('registration.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .getMany();
    const numberRecords = await registration.getCount();
    const { entities } = await registration.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findAll(
    pageOptionsDto: RegistrationFilterDto,
  ): Promise<PageDto<RegistrationDto>> {
    const items =
      this.registrationRepository.createQueryBuilder('registration');

    if (pageOptionsDto.status && pageOptionsDto.status.length > 0) {
      items.andWhere('registration.status IN (:status)', {
        status: pageOptionsDto.status.map((value) => value + 1),
      });
    }

    if (
      (await items.getRawAndEntities()).entities.length > 0 &&
      pageOptionsDto.user &&
      pageOptionsDto.user.length > 0
    ) {
      const emailCondition = pageOptionsDto.user
        .map((domain) => `user.email LIKE '%${domain}'`)
        .join(' OR ');
      items.andWhere(emailCondition);
    }

    items
      .leftJoinAndSelect('registration.user', 'user')
      .select([
        'registration',
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.address',
        'user.createBy',
        'user.updateBy',
        'user.photo',
        'user.status',
        'user.role',
      ])
      .orderBy('registration.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const numberRecords = await items.getCount();
    const { entities } = await items.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async addRegistration(createBy: number, updateBy: number, uid: number) {
    const user = await this.userService.findById(uid);
    if (user) {
      const registration = new RegistrationEntity({
        createBy: createBy,
        updateBy: updateBy,
        user,
      });
      return await this.registrationRepository.save(registration);
    }
    throw new BusinessException('404:Room not found!');
  }

  async findById(id: number) {
    const registration = await this.registrationRepository
      .createQueryBuilder('registration')
      .leftJoinAndSelect('registration.user', 'user')
      .select(['registration', 'user.id'])
      .where({ id })
      .getOne();
    if (registration) return registration;
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async getDetailById(id: number) {
    const registration = await this.registrationRepository
      .createQueryBuilder('registration')
      .leftJoinAndSelect('registration.user', 'user')
      .select(['registration', 'user.id'])
      .where({ id })
      .getOne();
    if (registration) {
      const items = await this.itemRegistrationServce.findByRegistrationId(id);
      return { registration, items };
    }
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async handleItems(items: ItemRegistration[]) {
    let listItem = [];
    items.map(async (item: ItemRegistration) => {
      if (isEmpty(listItem)) {
        listItem = [{ ...item }];
      } else {
        const index = listItem.findIndex(
          (value) => value.roomItemId === item.roomItemId,
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

  async createRegistration(data: AddItemRegistrationDto) {
    const { start_day, end_day, items } = data;
    delete data.items;
    // Check: date, categories, items;
    if (start_day > end_day) {
      throw new BusinessException(ErrorEnum.INVALID_DATE);
    }
    await Promise.all(
      items.map(async (item: ItemRegistration) => {
        if (!(item.quantity >= 1)) {
          throw new BusinessException('404:The quantity is invalid!');
        }
      }),
    );

    const handleItems: ItemRegistration[] = await this.handleItems(items);

    if (!handleItems) {
      throw new BusinessException('404:Nothing changes');
    }

    await Promise.all(
      handleItems.map(async (item) => {
        const roomItem = await this.roomItemService.findById(item.roomItemId);

        const availableQuantity =
          await this.roomItemService.getAvailableQuantity(roomItem.id);

        if (availableQuantity - item.quantity < 0)
          throw new BusinessException(
            '400:The quantity is not available for now!',
          );

        const itemQuantityBorrowed =
          roomItem.itemQuantityBorrowed + item.quantity;

        await this.roomItemService.updateRoomItemQuantityBorrowed(
          roomItem.id,
          itemQuantityBorrowed,
        );
      }),
    );

    const registration = await this.addRegistration(
      data.createBy,
      data.updateBy,
      data.user,
    );

    let registrationId = -1;

    await Promise.all(
      handleItems?.map(async ({ roomItemId, quantity, itemStatus }) => {
        registrationId = await this.itemRegistrationServce.addItemReg({
          ...data,
          start_day,
          end_day,
          itemStatus,
          quantity,
          registration,
          roomItemId,
        });
      }),
    );

    if (
      !isEmpty(
        await this.itemRegistrationServce.findByRegistrationId(registration.id),
      )
    ) {
      delete registration.user;
      return { registration: { id: registration.id } };
    } else {
      await this.registrationRepository.delete({ id: registration.id });
      return { registration: { id: registrationId } };
    }
  }

  async updateRegStatus(id, data: UpdateRegStatusDto) {
    if (await this.findById(id)) {
      await this.registrationRepository.update(
        { id },
        {
          status: data.status,
          updateBy: data.updateBy,
        },
      );

      return await this.findById(id);
    }
  }

  async updateByItemRegId(
    id: number,
    uid: number,
    data: UpdateItemRegistrationDto,
  ) {
    const items: ItemRegistration[] = [data.items];
    const itemReg = await this.itemRegistrationServce.findById(id);

    if (itemReg) {
      await Promise.all(
        items.map(async (item: ItemRegistration) => {
          if (await this.roomItemService.findById(item.roomItemId)) {
            if (item.quantity && !(item.quantity >= 1)) {
              throw new BusinessException('400:The quantity is invalid!');
            }

            if (_.isNil(item.roomItemId)) {
              item.roomItemId = itemReg.roomItem.id;
            }
          }
        }),
      );

      const handleItems: ItemRegistration[] = await this.handleItems(items);

      if (!handleItems) {
        throw new BusinessException('404:Nothing changes');
      }

      await Promise.all(
        handleItems.map(async (item) => {
          const roomItem = await this.roomItemService.findById(item.roomItemId);

          const availableQuantity =
            await this.roomItemService.getAvailableQuantity(roomItem.id);

          if (availableQuantity - item.quantity < 0)
            throw new BusinessException(
              '400:The quantity is not available for now!',
            );

          if (itemReg.roomItem.id !== roomItem.id) {
            await this.roomItemService.updateRoomItemQuantityBorrowed(
              itemReg.roomItem.id,
              itemReg.roomItem.itemQuantityBorrowed - itemReg.quantity,
            );

            await this.roomItemService.updateRoomItemQuantityBorrowed(
              roomItem.id,
              roomItem.itemQuantityBorrowed + item.quantity,
            );
          } else {
            await this.roomItemService.updateRoomItemQuantityBorrowed(
              roomItem.id,
              roomItem.itemQuantityBorrowed +
                (item.quantity - itemReg.quantity),
            );
          }
        }),
      );

      return await this.itemRegistrationServce.update(id, uid, data);
    }
  }
}
