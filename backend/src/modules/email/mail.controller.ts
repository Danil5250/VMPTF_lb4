import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Post('send')
    async send(@Body() body: { to: string; subject: string; message: string }) {
        return await this.mailService.sendMail(
            body.to,
            body.subject,
            body.message,
            `<h2>${body.message}</h2>`
        );
    }
}
