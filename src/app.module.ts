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
import { CategoryModule } from './modules/categories/category.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { ImageModule } from './modules/images/image.module';
import { SystemModule } from './modules/system/system.module';


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
    DatabaseModule,
    SystemModule,
    UserModule,
    AuthModule,
    MailModule,
    CategoryModule,
    EquipmentModule,
    ImageModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }]
})
export class AppModule {
}
