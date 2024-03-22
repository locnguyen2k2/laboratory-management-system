import { Module } from "@nestjs/common";
import { RoleModule } from "./role/role.module";

const modules = [
    RoleModule
]

@Module({
    imports: [...modules],
    exports: [...modules]
})

export class SystemModule { }