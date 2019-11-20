import { NotFoundException, BadRequestException } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { Repository, EntityRepository } from 'typeorm'
import { UsersEntity } from '../Entities/users.entity'
import { MailService } from '../Services/mail.service'
import { UpdateUserDto } from 'src/v1/User/Dto/update-user.dto'
import { configService } from '../Services/config.service'
import { MailSenderBody } from '../Services/Interfaces/mail.sender.interface'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

@EntityRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity> {

    constructor(
      private readonly mailService: MailService,
    ) {
      super()
    }

    async getUserByUsername(usernameParam: string): Promise<UsersEntity> {
        try {
            const profile: UsersEntity = await this.findOneOrFail({ username: usernameParam })
            return profile
        } catch (err) {
            throw new NotFoundException(`User with that username could not found in the database.`)
        }
    }

    async getUserByEmail(emailParam: string): Promise<UsersEntity> {
        try {
            return await this.findOneOrFail({ email: emailParam })
        } catch (err) {
            throw new NotFoundException(`This email does not exist in the database.`)
        }
    }

    async updateUser(usernameParam: string, dto: UpdateUserDto): Promise<UsersEntity> {
        const profile: UsersEntity = await this.findOneOrFail({
            username: usernameParam,
        })

        if (dto.fullName) profile.full_name = dto.fullName
        if (dto.password) {
            const hashedPassword = crypto.createHmac('sha256', dto.password).digest('hex')
            if (profile.password !== crypto.createHmac('sha256', dto.oldPassword).digest('hex')) {
                throw new BadRequestException(`Old password does not match.`)
            }
            profile.password = hashedPassword
        }
        if (dto.email) {
            const activateToken: JwtModule = jwt.sign({
                email: profile.email,
                username: profile.username,
                newEmail: dto.email,
                verifyUpdateEmailToken: true,
                exp: Math.floor(Date.now() / 1000) + (15 * 60), // Token expires in 15 min
            }, configService.get(`SECRET_KEY`))

            const activationUrl: string = `${configService.get(`APP_URL`)}/api/v1/user/verfiy-update-email?token=${activateToken}`
            const mailBody: MailSenderBody = {
                receiver: `${dto.email}`,
                subject: `Verify Your New Email [${profile.username}]`,
                text: `${activationUrl}`,
            }

            await this.mailService.send(mailBody)
        }

        return await this.save(profile)
    }

    async verifyUpdateEmail(decodedToken: { email: string, username: string, newEmail: string }) {
        try {
            const account: UsersEntity = await this.findOneOrFail({
                email: decodedToken.email,
                username: decodedToken.username,
            })

            account.email = decodedToken.newEmail
            await this.save(account)
        } catch (err) {
            throw new BadRequestException(`Incoming token is not valid.`)
        }
    }

    async disableUser(usernameParam: string) {
        try {
            const profile = await this.findOneOrFail({
                username: usernameParam,
            })

            profile.is_active = false
            await this.save(profile)
        } catch (err) {
            throw new NotFoundException(`User with that username could not found in the database.`)
        }
    }

    async activateUser(decodedToken: { email: string, username: string }) {
        try {
          const account: UsersEntity = await this.findOneOrFail({
              email: decodedToken.email,
              username: decodedToken.username,
          })

          account.is_active = true
          await this.save(account)
        } catch (err) {
            throw new BadRequestException(`Incoming token is not valid.`)
        }
    }

}
