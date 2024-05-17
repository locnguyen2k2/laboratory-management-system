import { ApiProperty } from "@nestjs/swagger";
import { iPageMetaDtoParameters } from "src/interfaces/page-meta-dto-parameteres.interface";

export class PageMetaDto {
    @ApiProperty()
    readonly page: number;

    @ApiProperty()
    readonly take: number;

    @ApiProperty()
    readonly numberRecords: number;

    @ApiProperty()
    readonly pages: number;

    @ApiProperty()
    readonly hasPrev: boolean;

    @ApiProperty()
    readonly hasNext: boolean;

    constructor({ pageOptionsDto, numberRecords }: iPageMetaDtoParameters) {
        this.page = pageOptionsDto.page;
        this.take = pageOptionsDto.take;
        this.numberRecords = numberRecords;
        this.pages = Math.ceil(this.numberRecords / this.take);
        this.hasPrev = this.page > 1;
        this.hasNext = this.page < this.pages;
    }
}