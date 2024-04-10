import { RoleEnum } from "src/enums/role-enum.enum";
import { UserStatus } from "../user.constant";

export interface AccountInfo {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    address: string,
    photo: string,
    role: RoleEnum
    status: UserStatus,
    createdAt: Date,
    updatedAt: Date
}