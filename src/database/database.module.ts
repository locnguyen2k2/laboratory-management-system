import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                entities: [],
                autoLoadEntities: true,
                port: configService.getOrThrow('DB_PORT'),
                host: configService.getOrThrow('DB_HOSTNAME'),
                database: configService.getOrThrow('DB_NAME'),
                username: configService.getOrThrow('DB_USERNAME'),
                password: configService.getOrThrow('DB_PASSWORD'),
                synchronize: configService.getOrThrow('DB_SYNCHRONIZE'),
            }),
            inject: [ConfigService]
        })
    ],
})

export class DatabaseModule { }