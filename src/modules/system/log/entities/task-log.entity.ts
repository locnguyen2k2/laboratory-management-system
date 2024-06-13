import { Entity } from 'typeorm';
import { CommonEntity } from '../../../../common/entity/common.entity';

@Entity({ name: 'task-log' })
export class TaskLogEntity extends CommonEntity {}
