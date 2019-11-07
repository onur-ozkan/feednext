import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Serializer } from 'jsonapi-serializer'
import { UsersEntity } from '../../../shared/Entities/users.entity'
import { UsersRepository } from '../../../shared/Repositories/users.repository'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
    ) {}

    async findOne(usernameParam: string): Promise<UsersEntity> {
        try {
            const result = await this.usersRepository.findOneOrFail({
                username: usernameParam,
            })
            return await new Serializer('users', { attributes: ['fullName', 'username', 'email', 'createdAt'] }).serialize(result)

        } catch (err) {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        }
    }
}
