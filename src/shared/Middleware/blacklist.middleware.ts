import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { RedisService } from '../Services/redis.service'

@Injectable()
export class BlacklistMiddleware implements NestMiddleware {
    constructor(private readonly redisService: RedisService) {}

    async use(req: FastifyRequest, _res: FastifyReply<Response>, next: Function) {
        const token = req.headers.authorization.substring(7)
        const isTokenDead = await this.redisService.getData(token)

        if (isTokenDead !== null) {
            throw new UnauthorizedException()
        }
        next()
    }
}
