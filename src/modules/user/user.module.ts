import { Module} from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { EmailModule } from "../email/email.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), EmailModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})

export class UserModule { }