import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { UsersRepository } from 'src/shared/Repositories/users.repository'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
    ) {}

    async getProfileByUsername(usernameParam: string): Promise<UsersEntity> {
        let result: any
        try {
            result = await this.usersRepository.findOneOrFail({
                username: usernameParam,
            })
        } catch (err) {
            throw new HttpException(err, HttpStatus.NOT_FOUND)
        }
        throw new HttpException({statusCode: 200, message: `OK`, data: result }, HttpStatus.OK)
    }
}
