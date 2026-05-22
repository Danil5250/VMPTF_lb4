import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendMail(to: string, subject: string, text: string, html?: string) {
        try {
            return await this.transporter.sendMail({
                from: `"AutoRepair System" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                text,
                html,
            });
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Помилка при відправці пошти');
        }
    }
}
