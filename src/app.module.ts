import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from './auth/guard/roles-auth.guard';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
    JwtModule.register({
      global: true,
      secret: new ConfigService().getOrThrow('JWT_SECRETKEY'),
      signOptions: { expiresIn: new ConfigService().getOrThrow('JWT_EXPIRATION') }
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    DatabaseModule, UserModule, AuthModule
  ],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }]
})
export class AppModule {
}
