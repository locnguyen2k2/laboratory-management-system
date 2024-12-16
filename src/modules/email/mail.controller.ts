import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { EmailFeedBackDto } from './dtos/email-confirm.dto';
import { MailService } from './mail.service';
import { env } from '../../global/env';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('feed-back')
  async sendFeedBackForPortfolio(@Body() data: EmailFeedBackDto) {
    if (data.key !== env('EMAIL_PASSWORD')) {
      throw new HttpException(`Access was denied!`, HttpStatus.BAD_REQUEST);
    }

    await this.mailService.sendEmail({
      to: 'locnguyen071102@gmail.com',
      subject: `Phản hồi từ: ${data.from}`,
      text: data.content,
    });

    return 'Gui thanh cong!';
  }
}
