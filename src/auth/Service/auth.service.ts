import {
    Injectable,
    BadRequestException,
    UnprocessableEntityException,
    NotFoundException,
    HttpStatus,
    HttpException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Serializer } from 'jsonapi-serializer'
import { Validator } from 'class-validator'
import { Repository } from 'typeorm'
import { configService } from '../../shared/Config/config.service'
import { CreateUserDto } from '../Dto/create-user.dto'
import { UserEntity } from '../../users/Entity/users.entity'
import { LoginDto } from '../Dto/login.dto'
import { RedisService } from '../../shared/Redis/redis.service'
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
        const decodedPass = crypto.createHmac(`sha256`, dto.password).digest(`hex`)

        if (dto.email) {
            try {
                await this.userRepository.findOneOrFail({
                    email: dto.email,
                    password: decodedPass,
                })
            } catch (err) {
                throw new NotFoundException(`Couldn't find an account that matching with this email and password in the database.`)
            }
        }

        try {
            await this.userRepository.findOneOrFail({
                username: dto.username,
                password: decodedPass,
            })
        } catch (err) {
            throw new NotFoundException(`Couldn't find an account that matching with this email and password in the database.`)
        }
    }

    async accountRecovery(dto: AccountRecoveryDto): Promise<HttpException> {
        try {
            const account = await this.userRepository.findOneOrFail({ email: dto.email })
            const generatePassword = await kmachine.keymachine()
            account.password = generatePassword
            await this.userRepository.save(account)

            const mailBody = {
                receiver: dto.email,
                subject: `Account Recovery [${account.username}]`,
                text: `By your request we have set your password as '${generatePassword}' for x hours, in that time please sign in and update your Account Password.`,
            }

            await this.sendMail(mailBody)
        } catch (err) {
            throw new NotFoundException(`This email is not exist in the database.`)
        }
        throw new HttpException(`OK`, HttpStatus.OK)
    }

    async accountVerification(incToken: string): Promise<HttpException> {
        const decodedToken: any = this.jwtService.decode(incToken)
        if (decodedToken) {
            const remainingTime = await decodedToken.exp - Math.floor(Date.now() / 1000)
            if (remainingTime <= 0) {
                throw new NotFoundException(`Incoming token is expired.`)
            }
        }

        try {
            const account = await this.userRepository.findOneOrFail({ email: decodedToken.email })
            account.isVerified = true
            await this.userRepository.save(account)
        } catch (err) {
            throw new NotFoundException(`Incoming token is not valid.`)
        }
        throw new HttpException(`Account has been verified.`, HttpStatus.OK)
    }

    async validateEmail(incEmail: string): Promise<any> {
        const validator = new Validator()
        if (validator.isEmail(incEmail)) {
            return
        }
        throw new BadRequestException(`Email is not an email.`)
    }

    async createToken(userEntity: UserEntity): Promise<HttpException> {
        const token = this.jwtService.sign({
            _id: userEntity._id,
            username: userEntity.username,
            email: userEntity.email,
            createdAt: userEntity.createdAt,
        })

        const responseData = {
            expiresIn: configService.get(`JWT_EXPIRATION_TIME`),
            accessToken: token,
            user: userEntity,
        }
        throw new HttpException({statusCode: 200, message: `Auth token has been generated.`, data: responseData}, HttpStatus.OK )
    }

    async killToken(token: string): Promise<HttpException> {
        const decodedToken: any = this.jwtService.decode(token)
        const expireDate = decodedToken.exp
        const remainingSeconds = Math.round(expireDate - Date.now() / 1000)

        await this.redisService.setOnlyKey(token, remainingSeconds)
        throw new HttpException(`Token has been destroyed.`, HttpStatus.OK)
    }

    async register(dto: CreateUserDto): Promise<HttpException> {
        // Create new user
        const newUser = new UserEntity({
            email: dto.email,
            username: dto.username,
            password: dto.password,
            fullName: dto.fullName,
        })

        let result: any

        try {
            result = await this.userRepository.save(newUser)
            result = await new Serializer(`user-identities`, {
                attributes: [`fullName`, `username`, `email`, `accessToken`],
            }).serialize(result)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }

        const verifyToken = jwt.sign({
            id: dto.username,
            email: dto.email,
            exp: Math.floor(Date.now() / 1000) + (15 * 60), // Token expires in 15 min
        }, configService.get(`SECRET_KEY`))

        const verificationUrl = `${configService.get(`APP_URL`)}/api/v1/auth/account-verification?token=${verifyToken}`

        const mailBody = {
            receiver: dto.email,
            subject: `Verify Your Account [${dto.username}]`,
            text: `${verificationUrl}`,
        }
        await this.sendMail(mailBody)

        const data = result.data
        throw new HttpException({statusCode: 200, message: `Account has been registered successfully to the database.`, data}, HttpStatus.OK)
    }

    private async sendMail(bodyData: EmailSenderBody) {
        const transporter = await nodemailer.createTransport({
            service: configService.get(`NODEMAILER_SERVICE`),
            auth: {
                user: configService.get(`NODEMAILER_MAIL`),
                pass: configService.get(`NODEMAILER_PASSWORD`),
            },
        })

        const mailOptions = {
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
