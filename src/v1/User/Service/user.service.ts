import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { OkException } from 'src/shared/Exceptions/ok.exception'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
    ) {}

    async getProfileByUsername(usernameParam: string): Promise<UsersEntity> {
        let result: UsersEntity
        let id: string
        try {
            result = await this.usersRepository.findOneOrFail({
                username: usernameParam,
            })
            id = String(result['_id'])

            delete result['_id']
            delete result['password']
            delete result['is_active']
            delete result['is_verified']
        } catch (err) {
            throw new NotFoundException(`User with that username could not found in the database.`)
        }
        throw new OkException(`user_profile`, result, `User ${result.username} successfully loaded.`, id)
    }
}
