import {
    Injectable,
    UnprocessableEntityException,
    NotFoundException,
    HttpStatus,
    HttpException,
} from '@nestjs/common'
import { JwtService, JwtModule } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Serializer } from 'jsonapi-serializer'
import { Repository } from 'typeorm'
import { configService } from '../../../shared/Config/config.service'
import { CreateUserDto } from '../Dto/create-user.dto'
import { UserEntity } from '../../users/Entity/users.entity'
import { LoginDto } from '../Dto/login.dto'
import { RedisService } from '../../../shared/Redis/redis.service'
import { AccountRecoveryDto } from '../Dto/account-recovery.dto'
import { EmailSenderBody } from '../Interface/email.sender.interface'
import * as crypto from 'crypto'
import * as nodemailer from 'nodemailer'
import * as jwt from 'jsonwebtoken'
import * as kmachine from 'keymachine'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async validateUser(dto: LoginDto): Promise<any> {
        const passwordHash: string = crypto.createHmac(`sha256`, dto.password).digest(`hex`)

        if (dto.email) {
            try {
                return await this.userRepository.findOneOrFail({
                    email: dto.email,
                    password: passwordHash,
                })
            } catch (err) {
                throw new NotFoundException(`Couldn't find an account that matching with this email and password in the database.`)
            }
        }

        try {
            return await this.userRepository.findOneOrFail({
                password: passwordHash,
            })
        } catch (err) {
            throw new NotFoundException(`Couldn't find an account that matching with this email and password in the database.`)
        }
    }

    async accountRecovery(dto: AccountRecoveryDto): Promise<HttpException> {
        try {
            const account: UserEntity = await this.userRepository.findOneOrFail({ email: dto.email })
            const generatePassword: string = await kmachine.keymachine()
            account.password = generatePassword
            await this.userRepository.save(account)

            const mailBody: EmailSenderBody = {
                receiver: dto.email,
                subject: `Account Recovery [${account.username}]`,
                text: `By your request we have set your password as '${generatePassword}' for x hours, in that time please sign in and update your Account Password.`,
            }

            await this.sendMail(mailBody)
        } catch (err) {
            throw new NotFoundException(`This email does not exist in the database.`)
        }
        throw new HttpException(`OK`, HttpStatus.OK)
    }

    async accountVerification(incToken: string): Promise<HttpException> {
        const decodedToken: any = this.jwtService.decode(incToken)
        if (decodedToken) {
            const remainingTime: number = await decodedToken.exp - Math.floor(Date.now() / 1000)
            if (remainingTime <= 0) {
                throw new NotFoundException(`Incoming token is expired.`)
            }
        }

        try {
            const account: UserEntity = await this.userRepository.findOneOrFail({ email: decodedToken.email })
            account.isVerified = true
            await this.userRepository.save(account)
        } catch (err) {
            throw new NotFoundException(`Incoming token is not valid.`)
        }
        throw new HttpException(`Account has been verified.`, HttpStatus.OK)
    }

    async createToken(userEntity: UserEntity): Promise<HttpException> {
        const token: string = this.jwtService.sign({
            _id: userEntity._id,
            username: userEntity.username,
            email: userEntity.email,
            createdAt: userEntity.createdAt,
        })

        const responseData: object = {
            expiresIn: configService.get(`JWT_EXPIRATION_TIME`),
            accessToken: token,
            user: userEntity,
        }
        throw new HttpException({statusCode: 200, message: `Access token has been generated.`, data: responseData}, HttpStatus.OK )
    }

    async killToken(token: string): Promise<HttpException> {
        const decodedToken: any = this.jwtService.decode(token)
        const expireDate: number = decodedToken.exp
        const remainingSeconds: number = Math.round(expireDate - Date.now() / 1000)

        await this.redisService.setOnlyKey(token, remainingSeconds)
        throw new HttpException(`Token has been destroyed.`, HttpStatus.OK)
    }

    async register(dto: CreateUserDto): Promise<HttpException> {
        const newUser: UserEntity = new UserEntity({
            email: dto.email,
            username: dto.username,
            password: dto.password,
            fullName: dto.fullName,
        })

        let result: object

        try {
            result = await this.userRepository.save(newUser)
            result = await new Serializer(`user-identities`, {
                attributes: [`fullName`, `username`, `email`, `accessToken`],
            }).serialize(result)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }

        const verifyToken: JwtModule = jwt.sign({
            id: dto.username,
            email: dto.email,
            exp: Math.floor(Date.now() / 1000) + (15 * 60), // Token expires in 15 min
        }, configService.get(`SECRET_KEY`))

        const verificationUrl: string = `${configService.get(`APP_URL`)}/api/v1/auth/account-verification?token=${verifyToken}`

        const mailBody: EmailSenderBody = {
            receiver: dto.email,
            subject: `Verify Your Account [${dto.username}]`,
            text: `${verificationUrl}`,
        }
        await this.sendMail(mailBody)

        const data: object = result['data']
        throw new HttpException({statusCode: 200, message: `Account has been registered successfully to the database.`, data}, HttpStatus.OK)
    }

    private async sendMail(bodyData: EmailSenderBody) {
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
