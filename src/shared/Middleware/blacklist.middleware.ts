import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { RedisService } from '../Redis/redis.service';

@Injectable()
export class BlacklistMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}
  // tslint:disable-next-line:ban-types
  async use(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization.substring(7);
    const isTokenDead = await this.redisService.getData(token);

    if (isTokenDead !== null) {
      throw new UnauthorizedException();
    }
    next();
  }
}
