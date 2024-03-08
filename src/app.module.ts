import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from '@nestjs/config';
import { RolesGuard } from './auth/guard/roles-auth.guard';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';


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
    DatabaseModule, UserModule, AuthModule, EmailModule
  ],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }]
})
export class AppModule {
}
