import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from '@nestjs/config';
import { RolesGuard } from './modules/auth/guard/roles-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './configs/database.config';
import { MailModule } from './modules/email/mail.module';
import { ItemModule } from './modules/items/item.module';
import { RoleModule } from './modules/role/role.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { RoomModule } from './modules/rooms/room.module';
import { CategoryModule } from './modules/categories/category.module';
import { UnitModule } from './modules/units/unit.module';
import { HandoverStatusModule } from './modules/handover_status/handover_status.module';
import { RoomItemModule } from './modules/room_items/room_item.module';

const modules = [
  DatabaseModule,
  UserModule,
  MailModule,
  AuthModule,
  RoleModule,
  CategoryModule,
  ItemModule,
  RoomModule,
  RegistrationModule,
  RoomItemModule,
  HandoverStatusModule,
  UnitModule,
]

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRETKEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION }
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: true,
    }),
    ...modules
  ],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }]
})
export class AppModule {
}
