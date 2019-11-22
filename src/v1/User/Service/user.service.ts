import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { OkException } from 'src/shared/Filters/ok-exception.filter'
import { UpdateUserDto } from '../Dto/update-user.dto'
import { serializerService } from 'src/shared/Services/serializer.service'
import { MailService } from 'src/shared/Services/mail.service'
import { MailSenderBody } from 'src/shared/Services/Interfaces/mail.sender.interface'
import { ActivateUserDto } from '../Dto/activate-user.dto'
import * as jwt from 'jsonwebtoken'
import { configService } from 'src/shared/Services/config.service'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
        private readonly mailService: MailService,
    ) {}

    async getUser(usernameParam: string): Promise<HttpException> {
        const profile: UsersEntity = await this.usersRepository.getUserByUsername(usernameParam)
        const id: string = String(profile._id)

        const properties: string[] = ['_id', 'password', 'is_active', 'is_verified']
        await serializerService.deleteProperties(profile, properties)

        throw new OkException(`user_profile`, profile, `User ${profile.username} is successfully loaded.`, id)
    }

    async updateUser(usernameParam: string, dto: UpdateUserDto): Promise<HttpException> {
        const profile = await this.usersRepository.updateUser(usernameParam, dto)
        const id = String(profile._id)

        const properties: string[] = ['_id', 'password', 'is_active', 'is_verified']
        await serializerService.deleteProperties(profile, properties)

        throw new OkException(`updated_profile`, profile, `User ${profile.username} is successfully updated.`, id)
    }

    async verifyUpdateEmail(incToken: string): Promise<HttpException> {
        const decodedToken: {verifyUpdateEmailToken: boolean, exp: number} | any = jwt.decode(incToken)

        if (decodedToken.verifyUpdateEmailToken) {
            const remainingTime: number = await decodedToken.exp - Math.floor(Date.now() / 1000)
            if (remainingTime <= 0) {
                throw new BadRequestException(`Incoming token is expired.`)
            }

            await this.usersRepository.verifyUpdateEmail(decodedToken)
            throw new HttpException(`Email has been updated.`, HttpStatus.OK)
        }

        throw new BadRequestException(`Incoming token is not valid.`)
    }

    async disableUser(usernameParam: string): Promise<HttpException> {
        await this.usersRepository.disableUser(usernameParam)
        throw new HttpException(`OK`, HttpStatus.OK)
    }

    async activateUser(incToken: string): Promise<HttpException> {
        const decodedToken: { activationToken: boolean, exp: number } | any = jwt.decode(incToken)

        if (decodedToken.activationToken) {
            const remainingTime: number = await decodedToken.exp - Math.floor(Date.now() / 1000)
            if (remainingTime <= 0) {
                throw new BadRequestException(`Incoming token is expired.`)
            }

            await this.usersRepository.activateUser(decodedToken)
            throw new HttpException(`Account has been activated.`, HttpStatus.OK)
        }

        throw new BadRequestException(`Incoming token is not valid.`)
    }

    async sendActivationMail(dto: ActivateUserDto): Promise<HttpException> {
        const user: UsersEntity = await this.usersRepository.getUserByEmail(dto.email)
        if (user.is_active) throw new BadRequestException(`This account is already active.`)

        const activateToken: JwtModule = jwt.sign({
            email: user.email,
            username: user.username,
            activationToken: true,
            exp: Math.floor(Date.now() / 1000) + (15 * 60), // Token expires in 15 min
        }, configService.getEnv('SECRET_KEY'))

        const activationUrl: string = `${configService.getEnv('APP_URL')}/api/v1/user/activate-user?token=${activateToken}`
        const mailBody: MailSenderBody = {
            receiver: `${dto.email}`,
            subject: `RE-Enable Your Account [${user.username}]`,
            text: `${activationUrl}`,
        }

        await this.mailService.send(mailBody)
        throw new HttpException(`OK`, HttpStatus.OK)
    }

}
