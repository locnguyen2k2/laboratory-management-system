import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ItemEntity } from './item.entity';
import { Repository } from 'typeorm';
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

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<ItemDto>> {
    const items = this.itemRepository.createQueryBuilder('item');
    items
      .leftJoinAndSelect('item.category', 'category')
      .select(['item', 'category.id', 'category.name'])
      .orderBy('item.createdAt', pageOptionsDto.order)
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

  async findByName(name: string, specification: string, serial_number: string) {
    return await this.itemRepository
      .createQueryBuilder('item')
      .where(
        "(replace(item.name, ' ', '') LIKE :name && replace(item.specification, ' ', '') LIKE :specification && replace(item.serial_number, ' ', '') LIKE :serial_number)",
        {
          name: name.replace(/\s/g, ''),
          specification: specification.replace(/\s/g, ''),
          serial_number: serial_number.replace(/\s/g, ''),
        },
      )
      .getOne();
  }

  async findByCategory(
    categoryId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ItemDto>> {
    if (await this.categoryService.findById(categoryId)) {
      const item = this.itemRepository.createQueryBuilder('item');

      item
        .leftJoinAndSelect('item.category', 'category')
        .where('(category.id = :categoryId)', { categoryId: categoryId })
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
      await this.itemRepository.update(
        { id: id },
        { handover: item.handover + quantity },
      );
      return await this.findById(id);
    }
  }

  async add(data: AddItemDto) {
    const item = await this.findByName(
      data.name,
      data.specification,
      data.serial_number,
    );
    if (item) {
      throw new HttpException(`The item is existed`, HttpStatus.BAD_REQUEST);
    }
    const category = await this.categoryService.findById(data.categoryId);
    await this.categoryService.updateQuantity(
      category.id,
      category.quantity + 1,
    );
    delete data.categoryId;

    const newItem = await this.itemRepository.save(
      new ItemEntity({ ...data, category: category }),
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
            item.serial_number,
          ))
        ) {
          const isReplace = listItem.findIndex(
            (item1) =>
              item1?.name == item?.name &&
              item1?.specification === item?.specification &&
              item1?.serial_number === item?.serial_number,
          );
          if (isReplace === -1) {
            listItem.push(item);
          }
        }
      }),
    );

    await Promise.all(
      listItem.map(async (item) => {
        const category = await this.categoryService.findById(item.categoryId);
        await this.categoryService.updateQuantity(
          category.id,
          category.quantity + 1,
        );
        delete item.categoryId;

        const newItem = new ItemEntity({
          ...item,
          createBy: data.createBy,
          updateBy: data.updateBy,
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
      const category = data.categoryId
        ? await this.categoryService.findById(data.categoryId)
        : item.category;

      delete data.categoryId;

      if (item && category) {
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

        const isExisted = await this.findByName(
          data.name,
          data.specification,
          data.serial_number,
        );

        if (isExisted && isExisted.id !== id) {
          throw new HttpException(
            `The item is existed`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const info = {
          ...data,
          ...(data.name ? { name: data.name } : { name: item.name }),
          ...(data.status ? { status: data.status } : { status: item.status }),
          ...(data.serial_number
            ? { serial_number: data.serial_number }
            : { serial_number: item.serial_number }),
          ...(data.unit ? { unit: data.unit } : { unit: item.unit }),
          ...(data.origin ? { origin: data.origin } : { origin: item.origin }),
          ...(data.specification
            ? { specification: data.specification }
            : { specification: item.specification }),
          ...(data.remark ? { remark: data.remark } : { remark: item.remark }),
        };

        await this.itemRepository.save({ ...item, category });

        await this.itemRepository.update({ id: id }, { ...info });

        return await this.findById(id);
      }
    }
  }
}
