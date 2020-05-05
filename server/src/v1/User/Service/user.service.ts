// Nest dependencies
import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Other dependencies
import * as jwt from 'jsonwebtoken'

// Local files
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { UpdateUserDto } from '../Dto/update-user.dto'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'
import { MailService } from 'src/shared/Services/mail.service'
import { MailSenderBody } from 'src/shared/Services/Interfaces/mail.sender.interface'
import { ActivateUserDto } from '../Dto/activate-user.dto'
import { configService } from 'src/shared/Services/config.service'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { AwsService } from 'src/shared/Services/aws.service'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
        @InjectRepository(EntriesRepository)
        private readonly entriesRepository: EntriesRepository,
        private readonly mailService: MailService,
        private readonly awsService: AwsService,
    ) {}

    async getUser(usernameParam: string): Promise<ISerializeResponse> {
        const profile: UsersEntity = await this.usersRepository.getUserByUsername(usernameParam)

        const properties: string[] = ['password', 'refresh_token', 'is_active', 'is_verified']
        await serializerService.deleteProperties(profile, properties)

        return serializerService.serializeResponse('user_profile', profile)
    }

    async getProfilePictureBuffer(username: string): Promise<unknown> {
        const user = await this.usersRepository.getUserByUsername(username)
        return this.awsService.getPictureBuffer(String(user.id), 'users')
    }

    async uploadProfilePicture(username, buffer: Buffer): Promise<void> {
        const user = await this.usersRepository.getUserByUsername(username)
        this.awsService.uploadPicture(String(user.id), 'users', buffer)
    }

    async deleteProfilePicture(username): Promise<void> {
        const user = await this.usersRepository.getUserByUsername(username)
        this.awsService.deletePicture(String(user.id), 'users')
    }

    async getVotes({ username, query }: {
        username: string,
        query: {
            skip: number,
            voteType: 'up' | 'down'
        }
   }): Promise<any> {
       await this.usersRepository.getUserByUsername(username)

       const result = await this.entriesRepository.getVotedEntriesByUsername({
           username,
           query
       })
       return serializerService.serializeResponse(`user_${query.voteType}_vote_list`, result)
   }

    async updateUser(usernameParam: string, dto: UpdateUserDto): Promise<ISerializeResponse> {
        const profile = await this.usersRepository.updateUser(usernameParam, dto)
        const id = String(profile.id)

        const properties: string[] = ['id', 'password', 'is_active', 'is_verified', 'refresh_token']
        await serializerService.deleteProperties(profile, properties)

        return serializerService.serializeResponse('updated_profile', profile, id)
    }

    async verifyUpdateEmail(incToken: string): Promise<HttpException> {
        const decodedToken: {verifyUpdateEmailToken: boolean, exp: number} | any = jwt.decode(incToken)

        if (decodedToken.verifyUpdateEmailToken) {
            const remainingTime: number = await decodedToken.exp - Math.floor(Date.now() / 1000)
            if (remainingTime <= 0) {
                throw new BadRequestException('Incoming token is expired.')
            }

            await this.usersRepository.verifyUpdateEmail(decodedToken)
            throw new HttpException('Email has been updated.', HttpStatus.OK)
        }

        throw new BadRequestException('Incoming token is not valid.')
    }

    async disableUser(usernameParam: string): Promise<HttpException> {
        await this.usersRepository.disableUser(usernameParam)
        throw new HttpException('OK', HttpStatus.OK)
    }

    async activateUser(incToken: string): Promise<HttpException> {
        const decodedToken: { activationToken: boolean, exp: number } | any = jwt.decode(incToken)

        if (decodedToken.activationToken) {
            const remainingTime: number = await decodedToken.exp - Math.floor(Date.now() / 1000)
            if (remainingTime <= 0) {
                throw new BadRequestException('Incoming token is expired.')
            }

            await this.usersRepository.activateUser(decodedToken)
            throw new HttpException('Account has been activated.', HttpStatus.OK)
        }

        throw new BadRequestException('Incoming token is not valid.')
    }

    async sendActivationMail(dto: ActivateUserDto): Promise<HttpException> {
        const user: UsersEntity = await this.usersRepository.getUserByEmail(dto.email)
        if (user.is_active) throw new BadRequestException('This account is already active.')

        const activateToken: string = jwt.sign({
            email: user.email,
            username: user.username,
            activationToken: true,
            exp: Math.floor(Date.now() / 1000) + (15 * 60), // Token expires in 15 min
        }, configService.getEnv('SECRET_FOR_ACCESS_TOKEN'))

        const activationUrl: string = `${configService.getEnv('APP_URL')}/api/v1/user/activate-user?token=${activateToken}`
        const mailBody: MailSenderBody = {
            receiver: dto.email,
            subject: `RE-Enable Your Account [${user.username}]`,
            text: activationUrl,
        }

        await this.mailService.send(mailBody)
        throw new HttpException('OK', HttpStatus.OK)
    }

}
