import { ApiPropertyOptional } from "@nestjs/swagger";

export class SearchItemDto {
    name?: string;
    origin?: string;
    serial_number?: string;
    quantity?: number;
    specification?: string;
    unit?: number;
    status?: number;
    handover?: number;
    categoryName?: string;
}

export enum SortItemDto {
    id = 'id',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
    createBy = 'createBy',
    updateBy = 'updateBy',
    name = 'name',
    origin = 'origin',
    serial_number = 'serial_number',
    quantity = 'quantity',
    specification = 'specification',
    remark = 'remark',
    unit = 'unit',
    status = 'status',
    handover = 'handover',
    categoryName = 'categoryName',
}