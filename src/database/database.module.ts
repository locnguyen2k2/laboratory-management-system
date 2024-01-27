import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            entities: [],
            autoLoadEntities: true,
            host: process.env.DB_HOSTNAME,
            port: +process.env.DB_PORT,
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            synchronize: true,
        })
    ],
})

export class DatabaseModule { }