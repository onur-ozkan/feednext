// Nest dependencies
import { Injectable, NestMiddleware, UnauthorizedException, Request, Response } from '@nestjs/common'

// Local files
import { RedisService } from '../Services/redis.service'

@Injectable()
export class BlacklistMiddleware implements NestMiddleware {
    constructor(private readonly redisService: RedisService) {}

    async use(@Request() req, @Response() _res, next: Function) {
        const token = req.headers.authorization.substring(7)
        const isTokenDead = await this.redisService.getData(token)

        if (isTokenDead !== null) {
            throw new UnauthorizedException()
        }
        next()
    }
}
