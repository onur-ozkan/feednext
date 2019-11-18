import {
    Injectable,
    UnprocessableEntityException,
    NotFoundException,
    HttpStatus,
    HttpException,
    BadRequestException,
} from '@nestjs/common'
import { JwtService, JwtModule } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { configService } from 'src/shared/Services/config.service'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { RedisService } from 'src/shared/Services/redis.service'
import { MailSenderBody } from 'src/shared/Services/Interfaces/mail.sender.interface'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { MailService } from 'src/shared/Services/mail.service'
import { OkException } from 'src/shared/Exceptions/ok.exception'
import { CreateAccountDto } from '../Dto/create-account.dto'
import { LoginDto } from '../Dto/login.dto'
import { AccountRecoveryDto } from '../Dto/account-recovery.dto'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import * as kmachine from 'keymachine'
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
        const newUser: UsersEntity = new UsersEntity({
            email: dto.email,
            username: dto.username,
            password: dto.password,
            full_name: dto.fullName,
        })

        let result: object

        try {
            result = await this.usersRepository.save(newUser)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }

        if (configService.isProduction()) {
            const verifyToken: JwtModule = jwt.sign({
                username: dto.username,
                email: dto.email,
                verificationToken: true,
                exp: Math.floor(Date.now() / 1000) + (15 * 60), // Token expires in 15 min
            }, configService.get(`SECRET_KEY`))

            const verificationUrl: string = `${configService.get(`APP_URL`)}/api/v1/auth/account-verification?token=${verifyToken}`

            const mailBody: MailSenderBody = {
                receiver: dto.email,
                subject: `Verify Your Account [${dto.username}]`,
                text: `${verificationUrl}`,
            }
            await this.mailService.send(mailBody)
        }

        const id: string = result['_id']

        const properties: string[] = ['_id', 'password', 'updated_at', 'is_verified']
        await serializerService.deleteProperties(result, properties)

        throw new OkException(`account_informations`, result, `Account has been registered successfully to the database.`, id)
    }

    async signIn(userEntity: UsersEntity): Promise<HttpException> {
        if (!userEntity.is_active) throw new BadRequestException(`Account is not active.`)

        const token: string = this.jwtService.sign({
            _id: userEntity._id,
            username: userEntity.username,
            email: userEntity.email,
            created_at: userEntity.created_at,
        })

        const id: any = userEntity._id
        const { _id, password, ...serializedUser } = userEntity

        const responseData: object = {
            access_token: token,
            user: serializedUser,
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

    async validateUser(dto: LoginDto): Promise<any> {
        const passwordHash: string = crypto.createHmac(`sha256`, dto.password).digest(`hex`)

        if (dto.email) {
            try {
                return await this.usersRepository.findOneOrFail({
                    email: dto.email,
                    password: passwordHash,
                })
            } catch (err) {
                throw new NotFoundException(`Couldn't find an account that matching with this email and password in the database.`)
            }
        }

        try {
            return await this.usersRepository.findOneOrFail({
                username: dto.username,
                password: passwordHash,
            })
        } catch (err) {
            throw new NotFoundException(`Couldn't find an account that matching with this username and password in the database.`)
        }
    }

    async accountRecovery(dto: AccountRecoveryDto): Promise<HttpException> {
        let account: UsersEntity

        try {
            account = await this.usersRepository.findOneOrFail({ email: dto.email })
        } catch (err) {
            throw new NotFoundException(`This email does not exist in the database.`)
        }

        if (!account.is_active) throw new BadRequestException(`Account is not active.`)

        const generatePassword: string = await kmachine.keymachine()
        account.password = generatePassword
        await this.usersRepository.save(account)

        const mailBody: MailSenderBody = {
            receiver: dto.email,
            subject: `Account Recovery [${account.username}]`,
            text: `By your request we have set your password as '${generatePassword}' for x hours, in that time please sign in and update your Account Password.`,
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

            try {
                const account: UsersEntity = await this.usersRepository.findOneOrFail({
                    email: decodedToken.email,
                    username: decodedToken.username,
                })

                account.is_verified = true
                await this.usersRepository.save(account)
            } catch (err) {
                throw new BadRequestException(`Incoming token is not valid.`)
            }

            throw new HttpException(`Account has been verified.`, HttpStatus.OK)
        }

        throw new BadRequestException(`Incoming token is not valid.`)
    }
}
