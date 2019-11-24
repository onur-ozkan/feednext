import { NotFoundException, BadRequestException, UnprocessableEntityException } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { Repository, EntityRepository } from 'typeorm'
import { UsersEntity } from '../Entities/users.entity'
import { MailService } from '../Services/mail.service'
import { UpdateUserDto } from 'src/v1/User/Dto/update-user.dto'
import { MailSenderBody } from '../Services/Interfaces/mail.sender.interface'
import { CreateAccountDto } from 'src/v1/Auth/Dto/create-account.dto'
import { LoginDto } from 'src/v1/Auth/Dto/login.dto'
import { AccountRecoveryDto } from 'src/v1/Auth/Dto/account-recovery.dto'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import * as kmachine from 'keymachine'
import { configService } from '../Services/config.service'

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

    async validateUser(dto: LoginDto, passwordHash: string): Promise<UsersEntity> {
        if (dto.email) {
            try {
                return await this.findOneOrFail({
                    email: dto.email,
                    password: passwordHash,
                })
            } catch (err) {
                throw new NotFoundException(`Couldn't find an account that matching with this email and password in the database.`)
            }
        }

        try {
            return await this.findOneOrFail({
                username: dto.username,
                password: passwordHash,
            })
        } catch (err) {
            throw new NotFoundException(`Couldn't find an account that matching with this username and password in the database.`)
        }
    }

    async createUser(dto: CreateAccountDto): Promise<UsersEntity> {
        const newUser: UsersEntity = new UsersEntity({
            email: dto.email,
            username: dto.username,
            password: dto.password,
            full_name: dto.fullName,
        })

        try {
            return await this.save(newUser)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
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
            }, configService.getEnv('SECRET_KEY'))

            const activationUrl: string = `${configService.getEnv('APP_URL')}/api/v1/user/verfiy-update-email?token=${activateToken}`
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

    async accountRecovery(dto: AccountRecoveryDto): Promise<{ account: UsersEntity, password: string }> {
        let account: UsersEntity

        try {
            account = await this.findOneOrFail({ email: dto.email })
        } catch (err) {
            throw new NotFoundException(`This email does not exist in the database.`)
        }

        if (!account.is_active) throw new BadRequestException(`Account is not active.`)

        const generatePassword: string = await kmachine.keymachine()
        account.password = crypto.createHmac(`sha256`, generatePassword).digest(`hex`)
        return {
            account: await this.save(account),
            password: generatePassword,
        }
    }

    async accountVerification(decodedToken: { email: string, username: string}) {
        try {
            const account: UsersEntity = await this.findOneOrFail({
                email: decodedToken.email,
                username: decodedToken.username,
            })

            account.is_verified = true
            await this.save(account)
        } catch (err) {
            throw new BadRequestException(`Incoming token is not valid.`)
        }
    }

}
