import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { configService } from './config.service'
import { EmailSenderBody } from './Interfaces/email.sender.interface'

@Injectable()
export class MailService {
    public async send(bodyData: EmailSenderBody) {
        const transporter: nodemailer = await nodemailer.createTransport({
            service: configService.get(`NODEMAILER_SERVICE`),
            auth: {
                user: configService.get(`NODEMAILER_MAIL`),
                pass: configService.get(`NODEMAILER_PASSWORD`),
            },
        })

        const mailOptions: object = {
            from: configService.get(`NODEMAILER_MAIL`),
            to: bodyData.receiver,
            subject: bodyData.subject,
            text: bodyData.text,
        }

        await transporter.sendMail(mailOptions, err => {
            if (err) {
                // tslint:disable-next-line:no-console
                console.log(err) // Gonna be logger for prod
            }
        })
    }
}
