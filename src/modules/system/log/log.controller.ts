import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Logs')
@Controller('Logs')
export class LogController {}
