import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "./role.entity";
import { Repository } from "typeorm";
import { UserRole } from "src/modules/user/user.constant";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
    ) { }

    async getRoleByUserId(id: number) {
        const roles = await this.roleRepository.find({
            where: {
                users: { id: id }
            }
        })

        if (roles)
            return roles.map(role => role.id)
        return []
    }

    async getRolesByUser(uid: number) {
        const roles = await this.roleRepository.find({
            where: {
                users: { id: uid }
            }
        })

        if (roles)
            return roles.map(role => role)
        return []
    }

    async findById(id: number) {
        return (await this.roleRepository.find({ where: { id } }))[0];
    }

    async checkUserHasRoleById(uid: number, rid: number) {
        const roles = await this.getRoleByUserId(uid);
        if (roles)
            return roles.includes(rid);
    }

    async isAdminRoleByUser(id: number) {
        const roles = await this.roleRepository.find({
            where: {
                users: { id }
            }
        })
        if (roles) {
            return roles.some(role =>
                role.id === UserRole.ADMIN
            )
        }
    }

    async hasAdminRole(roles: number[]): Promise<boolean> {
        return roles.includes(UserRole.ADMIN);
    }
}