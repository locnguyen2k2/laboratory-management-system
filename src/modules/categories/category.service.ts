import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddCategoryDto } from './dtos/add-category.dto';
import { UpdateDto } from './dtos/update.dto';
import { BusinessException } from 'src/common/exceptions/biz.exception';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { CategoryDto } from './dtos/category.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<CategoryDto>> {
    const items = this.categoryRepository.createQueryBuilder('item');
    items
      .orderBy('item.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const numberRecords = await items.getCount();
    const { entities } = await items.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ numberRecords, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findById(id: number) {
    const category = (
      await this.categoryRepository.find({ where: { id: id } })
    )[0];
    if (category) return category;
    throw new BusinessException(ErrorEnum.RECORD_NOT_FOUND);
  }

  async findByName(name: string) {
    return await this.categoryRepository
      .createQueryBuilder('item')
      .where("replace(item.name, ' ', '') LIKE :name", {
        name: name.replace(/\s/g, ''),
      })
      .getOne();
  }

  async add(data: AddCategoryDto) {
    const isExisted = await this.findByName(data.name);
    if (isExisted) {
      throw new HttpException(
        'The category is existed',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newCategory = new CategoryEntity(data);
    await this.categoryRepository.save(newCategory);
    return await this.findByName(data.name);
  }

  async updateQuantity(id: number, quantity: number) {
    const isExisted = await this.findById(id);
    if (isExisted) {
      quantity >= 0 &&
        (await this.categoryRepository.update(
          { id: id },
          { quantity: quantity },
        ));
      return await this.findById(id);
    }
  }

  async update(id: number, data: UpdateDto) {
    const category = await this.findById(id);
    if (category) {
      const isExisted = await this.findByName(data.name);
      if (isExisted && isExisted.id !== id) {
        throw new BusinessException(ErrorEnum.RECORD_IS_EXISTED);
      }
      if (category) {
        await this.categoryRepository.update(
          { id: id },
          {
            ...(data.name ? { name: data.name } : { name: category.name }),
            ...(data.status
              ? { status: data.status }
              : { status: category.status }),
          },
        );
        return await this.findById(id);
      }
    }
  }

  async deleteById(id: number) {
    const isExisted = await this.findById(id);
    if (isExisted) {
      if (isExisted.quantity === 0) {
        await this.categoryRepository.delete({ id: id });
        return await this.findAll(new PageOptionsDto());
      }
      throw new BusinessException(ErrorEnum.ITEM_IN_USED);
    }
  }
}
