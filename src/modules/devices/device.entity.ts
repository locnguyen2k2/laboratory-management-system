import { CommonEntity } from "src/common/entity/common.entity";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'device_entity' })
export class DeviceEntity extends CommonEntity {
}