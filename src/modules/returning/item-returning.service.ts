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

@Injectable()
export class ItemReturningService {
  constructor(
    @InjectRepository(ItemReturningEntity)
    private readonly itemReturningRepository: Repository<ItemReturningEntity>,
    private readonly itemRegistrationService: ItemRegistrationService,
    private readonly userService: UserService,
    private readonly roomItemService: RoomItemService,
  ) {}

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ItemReturningDto>> {
    const items =
      this.itemReturningRepository.createQueryBuilder('itemReturning');

    items
      .leftJoinAndSelect('itemReturning.itemRegistration', 'itemRegistration')
      .select(['itemReturning', 'itemRegistration.id'])
      .orderBy('itemReturning.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const numberRecords = await items.getCount();
    const { entities } = await items.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findById(id: number) {
    const item =
      await this.itemReturningRepository.createQueryBuilder('itemReturning');
    item.where({ id }).getOne();

    if (item) return item;
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async findByRegId() {}

  async findByUid(
    uid: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ItemReturningDto>> {
    const items =
      this.itemReturningRepository.createQueryBuilder('itemReturning');

    items
      .leftJoinAndSelect('itemReturning.itemRegistration', 'itemRegistration')
      .where('(itemReturning.updateBy = :uid)', { uid })
      .select(['itemReturning', 'itemRegistration.id'])
      .orderBy('itemReturning.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const numberRecords = await items.getCount();
    const { entities } = await items.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async add(data: AddItemReturningDto) {
    const itemRegistration = await this.itemRegistrationService.findById(
      data.itemRegistrationId,
    );
    if (itemRegistration) {
      if (
        itemRegistration.quantityReturned + data.quantity <=
        itemRegistration.quantity
      ) {
        const roomItem = await this.roomItemService.findByItemRoom(
          itemRegistration.item.id,
          itemRegistration.room.id,
        );

        await this.roomItemService.updateRoomItemQuantityReturned(
          roomItem.id,
          roomItem.itemQuantityReturned + data.quantity,
        );

        await this.itemRegistrationService.updateQuantityReturned(
          data.itemRegistrationId,
          data.quantity + itemRegistration.quantityReturned,
        );

        const newItem = new ItemReturningEntity({ ...data, itemRegistration });
        await this.itemReturningRepository.save(newItem);

        return newItem;
      }
      throw new BusinessException('400:The quantity invalid!');
    }
  }

  async update() {}

  async delete() {}
}
