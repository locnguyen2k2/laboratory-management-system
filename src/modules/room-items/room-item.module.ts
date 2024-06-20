import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomItemEntity } from './room-item.entity';
import { UserModule } from 'src/modules/user/user.module';
import { RoomItemController } from './room-item.controller';
import { RoomItemService } from './room-item.service';
import { ItemModule } from '../items/item.module';
import { RoomModule } from '../rooms/room.module';
import { ItemRegistrationModule } from '../item-registration/item-registration.module';
import { CategoryModule } from '../categories/category.module';
import { MailModule } from '../email/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomItemEntity]),
    UserModule,
    ItemModule,
    RoomModule,
    CategoryModule,
    MailModule,
    ItemRegistrationModule,
  ],
  controllers: [RoomItemController],
  providers: [RoomItemService],
  exports: [RoomItemService],
})
export class RoomItemModule {}
