import { Injectable, NestMiddleware, Request, Response, BadRequestException } from '@nestjs/common'
import { currentUserService } from '../Services/current-user.service'
import { UsersRepository } from '../Repositories/users.repository'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly usersRepository: UsersRepository) {}

    async use(@Request() req, @Response() _res, next: Function) {
        const token = req.headers.authorization.substring(7)
        const currentUsername = currentUserService.getCurrentUser(token, `username`)
        const userData = await this.usersRepository.findOneOrFail({username: currentUsername})

        if (userData && !userData.is_active) throw new BadRequestException(`This user account is not active.`)

        next()
    }
}
