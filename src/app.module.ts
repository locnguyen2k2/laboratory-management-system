import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
    JwtModule.register({
      global: true,
      secret: new ConfigService().getOrThrow('JWT_SECRETKEY'),
      signOptions: { expiresIn: new ConfigService().getOrThrow('JWT_EXPIRATION') }
    }),
    DatabaseModule, UserModule, AuthModule
  ],
})
export class AppModule { }
