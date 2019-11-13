import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { OkException } from 'src/shared/Exceptions/ok.exception'
import { UpdateUserDto } from '../Dto/update-user.dto'
import * as crypto from 'crypto'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
    ) {}

    async getProfileByUsername(usernameParam: string): Promise<UsersEntity> {
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

        delete profile['_id']
        delete profile['password']
        delete profile['is_active']
        delete profile['is_verified']
        throw new OkException(`user_profile`, profile, `User ${profile.username} is successfully loaded.`, id)
    }

    async updateProfileByUsername(usernameParam: string, dto: UpdateUserDto): Promise<UsersEntity> {
        const profile = await this.usersRepository.findOne({
            username: usernameParam,
        })

        if (!profile) {
            throw new NotFoundException(`User with that username could not found in the database.`)
        }

        const id = String(profile._id)

        try {
            if (dto.fullName) profile.full_name = dto.fullName
            if (dto.email) profile.email = dto.email
            if (dto.password) {
                const hashedPassword = crypto.createHmac('sha256', dto.password).digest('hex')
                profile.password = hashedPassword
            }

            await this.usersRepository.save(profile)
        } catch (err) {
            throw new BadRequestException(`The email that entered is duplicated in the database.`)
        }

        delete profile['_id']
        delete profile['password']
        delete profile['is_active']
        delete profile['is_verified']
        throw new OkException(`updated_profile`, profile, `User ${profile.username} is successfully updated.`, id)
    }

}