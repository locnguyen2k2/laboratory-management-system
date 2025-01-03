import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ItemEntity } from './item.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddItemDto, AddListItemDto } from './dtos/add-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { CategoryService } from '../categories/category.service';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { ItemDto } from './dtos/item.dto';
import { RoomService } from '../rooms/room.service';
import { SortItemDto } from './dtos/search-item.dto';
import { ItemFilterDto } from './item.constant';
import { CategoryEnum } from '../categories/category.constant';

const _ = require('lodash');

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    private readonly categoryService: CategoryService,
    private readonly roomService: RoomService,
  ) {}

  async findAll(pageOptionsDto: ItemFilterDto): Promise<PageDto<ItemDto>> {
    const items = this.itemRepository.createQueryBuilder('item');

    !_.isEmpty(pageOptionsDto.keyword) &&
      items.andWhere(
        `MATCH(item.name, item.remark) AGAINST (:keyword IN NATURAL LANGUAGE MODE)`,
        { keyword: pageOptionsDto.keyword },
      );

    if (pageOptionsDto.producer && pageOptionsDto.producer.length > 0) {
      items.andWhere('LOWER(item.origin) in (:origin)', {
        origin: pageOptionsDto.producer.map((value) => value.toLowerCase()),
      });
    }

    if (pageOptionsDto.status && pageOptionsDto.status.length > 0) {
      items.andWhere('item.status IN (:status)', {
        status: pageOptionsDto.status.map((value) => value + 1),
      });
    }

    if (Object.values<string>(SortItemDto).includes(pageOptionsDto.sort)) {
      items.orderBy(`item.${pageOptionsDto.sort}`, pageOptionsDto.order);
    } else {
      items.orderBy('item.createdAt', pageOptionsDto.order);
    }

    items
      .leftJoinAndSelect('item.category', 'category')
      .select(['item', 'category.id', 'category.name'])
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const numberRecords = await items.getCount();
    const { entities } = await items.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findById(id: number) {
    const item = await this.itemRepository
      .createQueryBuilder('item')
      .where({ id: id })
      .leftJoinAndSelect('item.category', 'category')
      .select(['item', 'category'])
      .getOne();
    if (item) return item;
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async findByName(
    name: string,
    specification: number,
    volume: number,
    serial_number: string,
  ) {
    return await this.itemRepository
      .createQueryBuilder('item')
      .where(
        "(replace(item.name, ' ', '') LIKE :name && item.specification = :specification && item.volume = :volume && replace(item.serial_number, ' ', '') LIKE :serial_number)",
        {
          name: name.replace(/\s/g, ''),
          specification: specification,
          volume: volume,
          serial_number: serial_number.replace(/\s/g, ''),
        },
      )
      .getOne();
  }

  async findByCategory(
    categoryId: number,
    pageOptionsDto: ItemFilterDto,
  ): Promise<PageDto<ItemDto>> {
    if (await this.categoryService.findById(categoryId)) {
      const item = this.itemRepository.createQueryBuilder('item');
      item.leftJoinAndSelect('item.category', 'category');
      item.andWhere('category.id = :categoryId', { categoryId: categoryId });

      if (pageOptionsDto.keyword) {
        item.andWhere(
          new Brackets((qb) => {
            qb.where('LOWER(item.name) LIKE LOWER(:keyword)', {
              keyword: `%${pageOptionsDto.keyword}%`,
            })
              .orWhere('LOWER(item.origin) LIKE LOWER(:keyword)', {
                keyword: `%${pageOptionsDto.keyword}%`,
              })
              .orWhere('LOWER(item.remark) LIKE LOWER(:keyword)', {
                keyword: `%${pageOptionsDto.keyword}%`,
              })
              .orWhere('LOWER(item.serial_number) LIKE LOWER(:keyword)', {
                keyword: `%${pageOptionsDto.keyword}%`,
              })
              .orWhere('LOWER(item.handover) LIKE LOWER(:keyword)', {
                keyword: `%${pageOptionsDto.keyword}%`,
              })
              .orWhere('LOWER(item.quantity) LIKE LOWER(:keyword)', {
                keyword: `%${pageOptionsDto.keyword}%`,
              })
              .orWhere('LOWER(category.name) LIKE LOWER(:keyword)', {
                keyword: `%${pageOptionsDto.keyword}%`,
              });
          }),
        );
      }

      if (pageOptionsDto.producer && pageOptionsDto.producer.length > 0) {
        item.where('LOWER(item.origin) in (:origin)', {
          origin: pageOptionsDto.producer.map((value) => value.toLowerCase()),
        });
      }

      if (pageOptionsDto.status && pageOptionsDto.status.length > 0) {
        item.andWhere('item.status IN (:status)', {
          status: pageOptionsDto.status.map((value) => value + 1),
        });
      }

      if (Object.values<string>(SortItemDto).includes(pageOptionsDto.sort)) {
        item.orderBy(`item.${pageOptionsDto.sort}`, pageOptionsDto.order);
      } else {
        item.orderBy('item.createdAt', pageOptionsDto.order);
      }

      item
        .select(['item'])
        .orderBy('item.createdAt', pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take);

      const numberRecords = await item.getCount();
      const { entities } = await item.getRawAndEntities();
      const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
      return new PageDto(entities, pageMetaDto);
    }
  }

  async getAvailableQuantity(id: number): Promise<number> {
    const isExisted = await this.findById(id);
    if (isExisted)
      return isExisted.quantity - isExisted.handover > 0
        ? isExisted.quantity - isExisted.handover
        : 0;
  }

  async isHandover(id: number): Promise<boolean> {
    const isExisted = await this.findById(id);
    return isExisted && isExisted.handover > 0 ? true : false;
  }

  async updateItemHandover(id: number, quantity: number) {
    const item = await this.findById(id);
    if (item) {
      item.quantity >= quantity &&
        (await this.itemRepository.update(
          { id: id },
          {
            handover: quantity,
            ...(item.category.id === CategoryEnum.CHEMICALS && {
              remaining_volume: item.total_volume - item.volume * quantity,
            }),
          },
        ));
      return await this.findById(id);
    }
  }

  async add(data: AddItemDto) {
    const item = await this.findByName(
      data.name,
      data.specification,
      data.volume,
      data.serial_number,
    );

    if (item) {
      throw new HttpException(`The item is existed`, HttpStatus.BAD_REQUEST);
    }

    if (data.categoryId === CategoryEnum.CHEMICALS) {
      if (_.isNil(data.volume)) {
        throw new BusinessException('400:Volume is require for this item!');
      }
    } else {
      item?.volume && delete item.volume;
    }

    let category = await this.categoryService.findById(data.categoryId);

    category = await this.categoryService.updateQuantity(
      category.id,
      category.quantity + 1,
    );

    delete data.categoryId;

    const newItem = await this.itemRepository.save(
      new ItemEntity({
        ...data,
        ...(data.volume && { total_volume: data.volume * data.quantity }),
        ...(data.volume && { remaining_volume: data.volume * data.quantity }),
        category,
      }),
    );

    return newItem;
  }

  async addListItem(data: AddListItemDto) {
    const listItem = [];
    await Promise.all(
      data.items.map(async (item) => {
        if (
          !(await this.findByName(
            item.name,
            item.specification,
            item.volume,
            item.serial_number,
          ))
        ) {
          const isReplace = listItem.findIndex(
            (item1) =>
              item1?.name == item?.name &&
              item1?.specification === item?.specification &&
              item1?.serial_number === item?.serial_number,
          );

          if (item.categoryId === CategoryEnum.CHEMICALS) {
            if (_.isNil(item.volume)) {
              throw new BusinessException(
                '400:Volume is require for chemical item!',
              );
            }
          } else {
            delete item.volume;
          }

          if (isReplace === -1) {
            listItem.push(item);
          }
        }
      }),
    );

    await Promise.all(
      listItem.map(async (item) => {
        let category = await this.categoryService.findById(item.categoryId);

        category = await this.categoryService.updateQuantity(
          category.id,
          category.quantity + 1,
        );
        delete item.categoryId;

        const newItem = new ItemEntity({
          ...item,
          createBy: data.createBy,
          updateBy: data.updateBy,
          ...(item.volume && { total_volume: item.volume * item.quantity }),
          ...(item.volume && { remaining_volume: item.volume * item.quantity }),
          category,
        });

        await this.itemRepository.save(newItem);
        item.categoryId = category.id;
      }),
    );

    return listItem;
  }

  async update(id: number, data: UpdateItemDto) {
    const item = await this.findById(id);

    if (item) {
      const category = !_.isNil(data.categoryId)
        ? await this.categoryService.findById(data.categoryId)
        : item.category;

      delete data.categoryId;

      if (item && category) {
        const isExisted = await this.findByName(
          data?.name ? data.name : '',
          data?.specification ? data.specification : 0,
          data?.volume ? data.volume : 0,
          data?.serial_number ? data.serial_number : '',
        );

        if (isExisted && isExisted.id !== id) {
          throw new HttpException(
            `The item is existed`,
            HttpStatus.BAD_REQUEST,
          );
        }

        if (data?.quantity < item.handover)
          throw new BusinessException(
            `400:the amount must be greater than or equal ${item.handover}`,
          );

        if (item.category.id !== category.id) {
          await this.categoryService.updateQuantity(
            item.category.id,
            item.category.quantity - 1,
          );

          await this.categoryService.updateQuantity(
            category.id,
            category.quantity + 1,
          );
        }

        if (category.id === CategoryEnum.CHEMICALS) {
          const quantity = data.quantity ? data.quantity : item.quantity;
          const volume = !_.isNil(data.volume) ? data.volume : item.volume;
          const total = volume * quantity;
          data.total_volume = total;
          data.remaining_volume = total - volume * item.handover;
        }

        const info = {
          ...(data.name ? { name: data.name } : { name: item.name }),
          ...(!_.isNil(data.status)
            ? { status: data.status }
            : { status: item.status }),
          ...(data.serial_number
            ? { serial_number: data.serial_number }
            : { serial_number: item.serial_number }),
          ...(!_.isNil(data.unit) ? { unit: data.unit } : { unit: item.unit }),
          ...(data.origin ? { origin: data.origin } : { origin: item.origin }),
          ...(data.specification
            ? { specification: data.specification }
            : { specification: item.specification }),
          ...(data.volume ? { volume: data.volume } : { volume: item.volume }),
          ...(!_.isNil(data.total_volume)
            ? { total_volume: data.total_volume }
            : { total_volume: item.total_volume }),
          ...(!_.isNil(data.remaining_volume)
            ? { remaining_volume: data.remaining_volume }
            : { remaining_volume: item.remaining_volume }),
          ...(!_.isNil(data.quantity)
            ? { quantity: data.quantity }
            : { quantity: item.quantity }),
          ...(data.remark ? { remark: data.remark } : { remark: item.remark }),
        };

        await this.itemRepository.save({ ...item, category });

        await this.itemRepository.update({ id: id }, { ...info });

        return await this.findById(id);
      }
    }
  }

  async deleteById(id: number) {
    const item = await this.findById(id);
    if (item) {
      if (item.handover === 0) {
        await this.categoryService.updateQuantity(
          item.category.id,
          item.category.quantity - 1,
        );
        await this.itemRepository.delete(id);

        return await this.findAll(new PageOptionsDto());
      }
      throw new BusinessException(ErrorEnum.ITEM_IN_USED);
    }
  }
}
