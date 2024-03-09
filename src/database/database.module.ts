import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./../modules/user/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: (process.env.DB_HOSTNAME),
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [UserEntity],
            synchronize: true,
        })
    ],
})

export class DatabaseModule { }