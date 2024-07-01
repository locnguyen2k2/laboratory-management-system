import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemReturningEntity } from './entities/item-returning.entity';
import { ItemReturningController } from './item-returning.controller';
import { ItemReturningService } from './item-returning.service';
import { ItemRegistrationModule } from '../item-registration/item-registration.module';
import { UserModule } from '../user/user.module';
import { RoomItemModule } from '../room-items/room-item.module';
import { RegistrationModule } from '../registration/registration.module';
import { ItemModule } from '../items/item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemReturningEntity]),
    ItemRegistrationModule,
    RegistrationModule,
    UserModule,
    RoomItemModule,
    ItemModule,
  ],
  controllers: [ItemReturningController],
  providers: [ItemReturningService],
})
export class ItemReturningModule {}
