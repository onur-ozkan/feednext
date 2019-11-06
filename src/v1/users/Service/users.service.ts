import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Serializer } from 'jsonapi-serializer'
import { UserEntity } from '../../../shared/Entities/users.entity'
import { UserRepository } from '../../../shared/Repositories/user.repository'

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    async findOne(usernameParam: string): Promise<UserEntity> {
        try {
            const result = await this.userRepository.findOneOrFail({
                username: usernameParam,
            })
            return await new Serializer('users', { attributes: ['fullName', 'username', 'email', 'createdAt'] }).serialize(result)

        } catch (err) {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        }
    }
}
