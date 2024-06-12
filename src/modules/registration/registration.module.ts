import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationEntity } from './registration.entity';
import { UserModule } from '../user/user.module';
import { RegistrationService } from './registration.service';
import { ItemRegistrationModule } from './../item-registration/item-registration.module';
import { RegistrationController } from './registration.controller';
import { RoomModule } from '../rooms/room.module';
import { ItemModule } from '../items/item.module';
import { RoomItemModule } from '../room-items/room-item.module';

const modules = [ItemRegistrationModule];

@Module({
  imports: [
    ...modules,
    TypeOrmModule.forFeature([RegistrationEntity]),
    UserModule,
    ItemModule,
    RoomModule,
    RoomItemModule,
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
