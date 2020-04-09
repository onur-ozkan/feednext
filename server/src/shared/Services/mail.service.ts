// Nest dependencies
import { Injectable } from '@nestjs/common'

// Other dependencies
import * as nodemailer from 'nodemailer'

// Local files
import { MailSenderBody } from './Interfaces/mail.sender.interface'
import { configService } from './config.service'

@Injectable()
export class MailService {
    public async send(bodyData: MailSenderBody) {
        const transporter: nodemailer = await nodemailer.createTransport({
            service: configService.getEnv('NODEMAILER_SERVICE'),
            auth: {
                user: configService.getEnv('NODEMAILER_MAIL'),
                pass: configService.getEnv('NODEMAILER_PASSWORD'),
            },
        })

        const mailOptions: object = {
            from: configService.getEnv('NODEMAILER_MAIL'),
            to: bodyData.receiver,
            subject: bodyData.subject,
            text: bodyData.text,
        }

        await transporter.sendMail(mailOptions, err => {
            if (err) {
                // console.log(err) // Gonna be logger for prod
            }
        })
    }
}
