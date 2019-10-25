import { configService } from '../Config/config.service';
import * as Redis from 'ioredis';

export class RedisService {

  private redisConnection() {
    return new Redis({
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
      password: configService.get('REDIS_PASSWORD'),
    });
  }

  public setData(key: any, value: any, expireTime?: number) {
    if (expireTime) {
      this.redisConnection().set(key, value, 'EX', expireTime);
    } else {
      this.redisConnection().set(key, value);
    }
  }

  public getData(key: any) {
    return this.redisConnection().get(key);
  }
}
