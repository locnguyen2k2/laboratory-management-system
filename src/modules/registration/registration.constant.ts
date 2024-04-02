export interface AddRegistration {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    createBy: number;
    updateBy: number;
    user_id: number;
}

export interface ItemRegistration {
    itemId: number,
    quantity: number
    categoryId: number,
}