import { CommonEntity } from 'src/common/entity/common.entity';
import { Column, Entity } from 'typeorm';

@Entity('image_entity')
export class ImageEntity extends CommonEntity {
  @Column()
  name: string;

  @Column()
  dir: string;

  constructor(imageEntity: Partial<ImageEntity>) {
    super();
    Object.assign(this, imageEntity);
  }
}
