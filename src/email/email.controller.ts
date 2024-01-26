import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { EmailLinkConfirmDto } from "./dtos/email-confirm.dto";

@Controller('email')
export class EmailController {
    constructor(
        private readonly emailService: EmailService
    ) { }

    @ApiBearerAuth()
    @Post('resend-confirmation-link')
    async resendConfirmationLink(@Body() req: EmailLinkConfirmDto) {
        return await this.emailService.resendConfirmationLink(req.email)
    }
}