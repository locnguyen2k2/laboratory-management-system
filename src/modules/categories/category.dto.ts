import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entity/common.entity";
import { Column, Entity } from "typeorm";

@Entity('category_entity')
export class CategoryEntity extends CommonEntity {
    @Column()
    @Expose()
    @IsString()
    @IsNotEmpty()
    name: string;
}