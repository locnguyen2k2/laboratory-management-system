import { Controller, Post } from "@nestjs/common";
import { ImageService } from "./image.service";

@Controller('images')
export class ImageController {
    constructor(
        private readonly imageService: ImageService,
    ) { }
    @Post()
    async add() {
        
     }
}