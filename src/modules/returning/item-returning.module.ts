import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemReturningEntity } from './entities/item-returning.entity';
import { ItemReturningController } from './item-returning.controller';
import { ItemReturningService } from './item-returning.service';
import { ItemRegistrationModule } from '../item-registration/item-registration.module';
import { UserModule } from '../user/user.module';
import { RoomItemModule } from '../room-items/room-item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemReturningEntity]),
    ItemRegistrationModule,
    UserModule,
    RoomItemModule,
  ],
  controllers: [ItemReturningController],
  providers: [ItemReturningService],
})
export class ItemReturningModule {}
