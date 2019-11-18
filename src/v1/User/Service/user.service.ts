import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { OkException } from 'src/shared/Exceptions/ok.exception'
import { UpdateUserDto } from '../Dto/update-user.dto'
import { serializerService } from 'src/shared/Services/serializer.service'
import { MailService } from 'src/shared/Services/mail.service'
import { MailSenderBody } from 'src/shared/Services/Interfaces/mail.sender.interface'
import { ActivateUserDto } from '../Dto/activate-user.dto'
import { configService } from 'src/shared/Services/config.service'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
        private readonly mailService: MailService,
    ) {}

    async getUser(usernameParam: string): Promise<UsersEntity> {
        let profile: UsersEntity
        let id: string
        try {
            profile = await this.usersRepository.findOneOrFail({
                username: usernameParam,
            })
            id = String(profile['_id'])

        } catch (err) {
            throw new NotFoundException(`User with that username could not found in the database.`)
        }

        const properties: string[] = ['_id', 'password', 'is_active', 'is_verified']
        await serializerService.deleteProperties(profile, properties)

        throw new OkException(`user_profile`, profile, `User ${profile.username} is successfully loaded.`, id)
    }

    async updateUser(usernameParam: string, dto: UpdateUserDto): Promise<UsersEntity> {
        const profile = await this.usersRepository.findOne({
            username: usernameParam,
        })

        if (!profile) {
            throw new NotFoundException(`User with that username could not found in the database.`)
        }

        const id = String(profile._id)

        if (dto.fullName) profile.full_name = dto.fullName
        if (dto.email) profile.email = dto.email
        if (dto.password) {
            const hashedPassword = crypto.createHmac('sha256', dto.password).digest('hex')
            if (profile.password !== crypto.createHmac('sha256', dto.oldPassword).digest('hex')) {
                throw new BadRequestException(`Old password does not match.`)
            }
            profile.password = hashedPassword
        }

        await this.usersRepository.save(profile)

        const properties: string[] = ['_id', 'password', 'is_active', 'is_verified']
        await serializerService.deleteProperties(profile, properties)

        throw new OkException(`updated_profile`, profile, `User ${profile.username} is successfully updated.`, id)
    }

    async disableUser(usernameParam: string): Promise<HttpException> {

        try {
            const profile = await this.usersRepository.findOneOrFail({
                username: usernameParam,
            })

            profile.is_active = false
            await this.usersRepository.save(profile)
        } catch (err) {
            throw new NotFoundException(`User with that username could not found in the database.`)
        }

        throw new HttpException(`OK`, HttpStatus.OK)
    }

    async activateUser(incToken: string): Promise<HttpException> {
        const decodedToken: any = jwt.decode(incToken)

        if (decodedToken.activationToken) {
            const remainingTime: number = await decodedToken.exp - Math.floor(Date.now() / 1000)
            if (remainingTime <= 0) {
                throw new BadRequestException(`Incoming token is expired.`)
            }

            try {
                const account: UsersEntity = await this.usersRepository.findOneOrFail({
                    email: decodedToken.email,
                    username: decodedToken.username,
                })

                account.is_active = true
                await this.usersRepository.save(account)
            } catch (err) {
                throw new BadRequestException(`Incoming token is not valid.`)
            }

            throw new HttpException(`Account has been activated.`, HttpStatus.OK)
        }

        throw new BadRequestException(`Incoming token is not valid.`)
    }

    async sendActivationMail(dto: ActivateUserDto): Promise<HttpException> {
        let user: UsersEntity

        try {
            user = await this.usersRepository.findOneOrFail({ email: dto.email })
        } catch (err) {
            throw new NotFoundException(`This email does not exist in the database.`)
        }

        if (user.is_active) throw new BadRequestException(`This account is already active.`)

        const activateToken: JwtModule = jwt.sign({
            email: user.email,
            username: user.username,
            activationToken: true,
            exp: Math.floor(Date.now() / 1000) + (15 * 60), // Token expires in 15 min
        }, configService.get(`SECRET_KEY`))

        const activationUrl: string = `${configService.get(`APP_URL`)}/api/v1/user/activate-user?token=${activateToken}`
        const mailBody: MailSenderBody = {
            receiver: `${dto.email}`,
            subject: `RE-Enable Your Account [${user.username}]`,
            text: `${activationUrl}`,
        }

        await this.mailService.send(mailBody)
        throw new HttpException(`OK`, HttpStatus.OK)
    }

}
