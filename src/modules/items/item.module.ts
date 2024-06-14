import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from './item.entity';
import { CategoryModule } from '../categories/category.module';
import { RoomModule } from '../rooms/room.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity]),
    UserModule,
    CategoryModule,
    RoomModule,
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
