import { UserStatus } from "../user.constant";

export interface AccountInfo {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    photo: string,
    status: UserStatus,
    createdAt: Date,
    updatedAt: Date
}