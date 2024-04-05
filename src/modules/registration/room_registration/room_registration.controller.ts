import { Body, Controller, Post } from "@nestjs/common";
import { RoomRegistrationService } from "./room_registration.service";
import { CheckRoomDto } from "./dtos/check-room.dto";

@Controller('room_registration')
export class RoomRegistrationController {
    constructor(private readonly roomRegService: RoomRegistrationService) { }

    @Post('check')
    async checkRoomAvaliable(@Body() dto: CheckRoomDto) {
        const data = CheckRoomDto.plainToClass(dto);
        return await this.roomRegService.findByDay(data.start_day, data.end_day, data.roomid);
    }

}