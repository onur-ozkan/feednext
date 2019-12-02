// Nest dependencies
import { Injectable, HttpStatus, HttpException, BadRequestException } from '@nestjs/common'
import { JwtService, JwtModule } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'

// Other dependencies
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

// Local files
import { configService } from 'src/shared/Services/config.service'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { RedisService } from 'src/shared/Services/redis.service'
import { MailSenderBody } from 'src/shared/Services/Interfaces/mail.sender.interface'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { MailService } from 'src/shared/Services/mail.service'
import { OkException } from 'src/shared/Filters/ok-exception.filter'
import { CreateAccountDto } from '../Dto/create-account.dto'
import { LoginDto } from '../Dto/login.dto'
import { AccountRecoveryDto } from '../Dto/account-recovery.dto'
import { serializerService } from 'src/shared/Services/serializer.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private readonly mailService: MailService,
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
    ) {}

    async signUp(dto: CreateAccountDto): Promise<HttpException> {
        const result: UsersEntity = await this.usersRepository.createUser(dto)

        if (configService.isProduction()) {
            const verifyToken: JwtModule = jwt.sign({
                username: dto.username,
                email: dto.email,
                verificationToken: true,
                exp: Math.floor(Date.now() / 1000) + (15 * 60), // Token expires in 15 min
            }, configService.getEnv(`SECRET_KEY`))

            const verificationUrl: string = `${configService.getEnv(`APP_URL`)}/api/v1/auth/account-verification?token=${verifyToken}`

            const mailBody: MailSenderBody = {
                receiver: dto.email,
                subject: `Verify Your Account [${dto.username}]`,
                text: `${verificationUrl}`,
            }
            await this.mailService.send(mailBody)
        }

        const id: string = String(result.id)

        const properties: string[] = [`id`, `password`, `updated_at`, `is_verified`]
        await serializerService.deleteProperties(result, properties)

        throw new OkException(`account_informations`, result, `Account has been registered successfully to the database.`, id)
    }

    async signIn(userEntity: UsersEntity): Promise<HttpException> {
        if (!userEntity.is_active) throw new BadRequestException(`Account is not active.`)

        const token: string = this.jwtService.sign({
            id: userEntity.id,
            role: userEntity.role,
            username: userEntity.username,
            email: userEntity.email,
            created_at: userEntity.created_at,
        })

        const id: any = userEntity.id
        const properties: string[] = [`id`, `password`]
        await serializerService.deleteProperties(userEntity, properties)

        const responseData: object = {
            access_token: token,
            user: userEntity,
        }
        throw new OkException(`user_information`, responseData, `User successfully has been signed in.`, id)
    }

    async signOut(token: string): Promise<HttpException> {
        const decodedToken: any = jwt.decode(token)
        const expireDate: number = decodedToken.exp
        const remainingSeconds: number = Math.round(expireDate - Date.now() / 1000)

        await this.redisService.setOnlyKey(token, remainingSeconds)
        throw new OkException(`dead_token`, {token}, `Token has been killed.`)
    }

    async validateUser(dto: LoginDto): Promise<UsersEntity> {
        const passwordHash: string = crypto.createHmac(`sha256`, dto.password).digest(`hex`)
        return await this.usersRepository.validateUser(dto, passwordHash)
    }

    async accountRecovery(dto: AccountRecoveryDto): Promise<HttpException> {
        const result: { account: UsersEntity, password: string }  = await this.usersRepository.accountRecovery(dto)

        const mailBody: MailSenderBody = {
            receiver: dto.email,
            subject: `Account Recovery [${result.account.username}]`,
            text: `By your request we have set your password as '${result.password}' please sign in and update your Account Password.`,
        }

        await this.mailService.send(mailBody)
        throw new HttpException(`OK`, HttpStatus.OK)
    }

    async accountVerification(incToken: string): Promise<HttpException> {
        const decodedToken: any = jwt.decode(incToken)

        if (decodedToken.verificationToken) {
            const remainingTime: number = await decodedToken.exp - Math.floor(Date.now() / 1000)
            if (remainingTime <= 0) {
                throw new BadRequestException(`Incoming token is expired.`)
            }

            await this.usersRepository.accountVerification(decodedToken)

            throw new HttpException(`Account has been verified.`, HttpStatus.OK)
        }

        throw new BadRequestException(`Incoming token is not valid.`)
    }
}
