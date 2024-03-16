import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "./category.entity";
import { UserModule } from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity]), UserModule],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService]
})

export class CategoryModule { }