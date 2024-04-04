export interface ItemRegistration {
    itemId: number
    quantity: number
    categoryId: number
    schedules: number[]
}

export interface RoomRegistration {
    itemId: number
    schedules: number[]
}