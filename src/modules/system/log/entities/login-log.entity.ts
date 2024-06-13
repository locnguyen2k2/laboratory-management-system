import { Entity } from 'typeorm';
import { CommonEntity } from '../../../../common/entity/common.entity';

@Entity({ name: 'login-log' })
export class LoginLogEntity extends CommonEntity {}
