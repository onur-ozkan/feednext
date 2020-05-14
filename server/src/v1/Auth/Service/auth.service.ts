// Nest dependencies
import { Injectable, HttpStatus, HttpException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'

// Other dependencies
import * as jwt from 'jsonwebtoken'

// Local files
import { configService } from 'src/shared/Services/config.service'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { RedisService } from 'src/shared/Services/redis.service'
import { MailSenderBody } from 'src/shared/Services/Interfaces/mail.sender.interface'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { MailService } from 'src/shared/Services/mail.service'
import { CreateAccountDto } from '../Dto/create-account.dto'
import { LoginDto } from '../Dto/login.dto'
import { AccountRecoveryDto } from '../Dto/account-recovery.dto'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'
import { jwtManipulationService } from 'src/shared/Services/jwt.manipulation.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private readonly mailService: MailService,
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
    ) {}

    async signUp(dto: CreateAccountDto): Promise<ISerializeResponse> {
        const result: UsersEntity = await this.usersRepository.createUser(dto)

        if (configService.isProduction()) {
            const verifyToken = jwt.sign({
                username: dto.username,
                email: dto.email,
                verificationToken: true,
                exp: Math.floor(Date.now() / 1000) + (15 * 60), // Token expires in 15 min
            }, configService.getEnv('SECRET_FOR_ACCESS_TOKEN'))

            const verificationUrl: string = `${configService.getEnv('APP_URL')}/api/v1/auth/account-verification?token=${verifyToken}`

            const mailBody: MailSenderBody = {
                receiver: dto.email,
                subject: `Verify Your Account [${dto.username}]`,
                text: verificationUrl,
            }
            await this.mailService.send(mailBody)
        }

        const id: string = String(result.id)

        const properties: string[] = ['id', 'password', 'updated_at', 'is_verified']
        await serializerService.deleteProperties(result, properties)

        return serializerService.serializeResponse('account_informations', result, id)
    }

    async signIn(userEntity: UsersEntity, dto: LoginDto): Promise<HttpException | ISerializeResponse> {
        if (!userEntity.is_verified) throw new BadRequestException('Account is not verified, please verify your accunt')
        else if (!userEntity.is_active) throw new BadRequestException('Account is not active')

        const token: string = this.jwtService.sign({
            role: userEntity.role,
            username: userEntity.username,
            email: userEntity.email,
            created_at: userEntity.created_at
        })

        if (dto.rememberMe) userEntity.refresh_token = await this.usersRepository.triggerRefreshToken(dto.email || dto.username)

        const id: any = userEntity.id
        const properties: string[] = ['id', 'password']
        await serializerService.deleteProperties(userEntity, properties)

        const responseData: object = {
            access_token: token,
            user: userEntity,
        }

        return serializerService.serializeResponse('user_information', responseData, id)
    }

    async signOut(bearer: string): Promise<HttpException> {
        const decodedToken: any = jwtManipulationService.decodeJwtToken(bearer, 'all')
        await this.usersRepository.triggerRefreshToken(decodedToken.username)
        const expireDate: number = decodedToken.exp
        const remainingSeconds: number = Math.round(expireDate - Date.now() / 1000)

        await this.redisService.setOnlyKey(bearer.split(' ')[1], remainingSeconds)
        throw new HttpException('Token is killed', HttpStatus.OK)
    }

    async refreshToken(refreshToken: string): Promise<ISerializeResponse> {
        let decodedToken

        try {
            decodedToken = jwt.verify(refreshToken, configService.getEnv('SECRET_FOR_REFRESH_TOKEN'))
        } catch (error) {
            throw new BadRequestException('Invalid token signature')
        }

        let user: UsersEntity

        try {
            user = await this.usersRepository.findOneOrFail({
                username: decodedToken.username,
                refresh_token: refreshToken
            })
        } catch (e) {
            throw new BadRequestException('Refresh token is invalid')
        }

        const refreshedToken = this.jwtService.sign({
            id: user.id,
            role: user.role,
            username: user.username,
            email: user.email,
            created_at: user.created_at
        })

        return serializerService.serializeResponse('refreshed_access_token', { access_token: refreshedToken })
    }

    async validateUser(dto: LoginDto): Promise<UsersEntity> {
        return await this.usersRepository.validateUser(dto)
    }

    async accountRecovery(dto: AccountRecoveryDto): Promise<HttpException> {
        const { account, password }  = await this.usersRepository.accountRecovery(dto)

        const mailBody: MailSenderBody = {
            receiver: dto.email,
            subject: `Account Recovery [${account.username}]`,
            text: `By your request we have set your password as '${password}' please sign in and update your Account Password.`,
        }

        await this.mailService.send(mailBody)
        throw new HttpException('OK', HttpStatus.OK)
    }

    async accountVerification(incToken: string): Promise<HttpException> {
        let decodedToken
        try {
            decodedToken = jwt.verify(incToken, configService.getEnv('SECRET_FOR_ACCESS_TOKEN'))
        } catch (error) {
            throw new BadRequestException('Invalid token signature')
        }

        if (decodedToken.verificationToken) {
            const remainingTime: number = await decodedToken.exp - Math.floor(Date.now() / 1000)
            if (remainingTime <= 0) {
                throw new BadRequestException('Incoming token is expired.')
            }

            await this.usersRepository.accountVerification(decodedToken)

            throw new HttpException('Account has been verified.', HttpStatus.OK)
        }

        throw new BadRequestException('Incoming token is not valid.')
    }
}
