// Nest dependencies
import { Injectable } from '@nestjs/common'

// Other dependencies
import * as nodemailer from 'nodemailer'

// Local files
import { MailSenderBody } from './types'
import { configService } from './config.service'

@Injectable()
export class MailService {
    public send(bodyData: MailSenderBody): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const transporter = await nodemailer.createTransport({
                service: configService.getEnv('SMTP_SERVICE'),
                host: configService.getEnv('SMTP_HOST'),
                port: configService.getEnv('SMTP_PORT'),
                auth: {
                    user: configService.getEnv('SMTP_MAIL'),
                    pass: configService.getEnv('SMTP_PASSWORD'),
                }
            })

            const mailOptions: object = {
                from: configService.getEnv('SMTP_MAIL'),
                to: bodyData.receiver,
                subject: bodyData.subject,
                text: bodyData.text,
            }

            await transporter.sendMail(mailOptions, error => {
                if (error) reject(error)
                resolve()
            })
        })
    }
}
