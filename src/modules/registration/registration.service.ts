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
  RegistrationStatusEnum,
} from './registration.constant';
import { isEmpty } from 'lodash';
import { RoomService } from '../rooms/room.service';
import { RoomItemService } from '../room-items/room-item.service';
import { UpdateItemRegistrationDto } from '../item-registration/dtos/update-borrowing.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { RegistrationDto } from './dtos/registration.dto';

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
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RegistrationDto>> {
    const items =
      this.registrationRepository.createQueryBuilder('registration');
    items
      .leftJoinAndSelect('registration.user', 'user')
      .select(['registration', 'user.id'])
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
    items.map(async (item) => {
      if (isEmpty(listItem)) {
        listItem = [{ ...item }];
      } else {
        const index = listItem.findIndex(
          (value) =>
            value.itemId === item.itemId && value.roomId === item.roomId,
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
    let isItem = true;
    // Check: date, categories, items;
    if (start_day > end_day) {
      throw new BusinessException(ErrorEnum.INVALID_DATE);
    }
    await Promise.all(
      items.map(async (item: ItemRegistration) => {
        if (!(item.quantity >= 1)) {
          isItem = false;
          return;
        }
        if (
          !(await this.roomItemService.isRoomHasItem(item.roomId, item.itemId))
        ) {
          isItem = false;
          return;
        }
      }),
    );
    if (!isItem) {
      throw new BusinessException(
        '404:Item not found in room or quantity is less than 1!',
      );
    }

    const handleItems = await this.handleItems(items);
    if (!handleItems) {
      throw new BusinessException('404:Nothing changes');
    }
    const registration = await this.addRegistration(
      data.createBy,
      data.updateBy,
      data.user,
    );
    let registrationId = -1;
    await Promise.all(
      handleItems?.map(async ({ itemId, quantity, roomId, status }) => {
        const room = await this.roomService.findById(roomId);
        registrationId = await this.itemRegistrationServce.addItemReg({
          ...data,
          start_day,
          end_day,
          status,
          itemId,
          quantity,
          registration,
          room,
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

  async updateByItemRegId(
    id: number,
    uid: number,
    data: UpdateItemRegistrationDto,
  ) {
    let isItem = true;
    const items = [data.items];
    await Promise.all(
      items.map(async (item: ItemRegistration) => {
        if (!(item.quantity >= 1)) {
          isItem = false;
          return;
        }
        if (
          !(await this.roomItemService.isRoomHasItem(item.roomId, item.itemId))
        ) {
          isItem = false;
          return;
        }
      }),
    );
    if (!isItem) {
      throw new BusinessException(
        '404:Item not found in room or quantity is less than 1!',
      );
    }

    const handleItems = this.handleItems(items);
    if (!handleItems) {
      throw new BusinessException('404:Nothing changes');
    }
    const room = await this.roomService.findById(data.items.roomId);
    return await this.itemRegistrationServce.update(id, uid, data, room);
  }
}
