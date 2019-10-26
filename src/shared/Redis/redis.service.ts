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

  async setData(key: any, value: any, expireTime?: number) {
    if (expireTime) {
      await this.redisConnection().set(key, value, 'EX', expireTime);
    } else {
      await this.redisConnection().set(key, value);
    }
  }

  async setOnlyKey(key: any, expireTime?: number) {
    if (expireTime) {
      await this.redisConnection().set(key, null, 'EX', expireTime);
    } else {
      await this.redisConnection().set(key, null);
    }
  }

  async pushList(key: any, value: any, expireTime?: number) {
    if (expireTime) {
      await this.redisConnection().rpush(key, value);
      await this.redisConnection().expire(key, expireTime);
    } else {
      await this.redisConnection().rpush(key, value);
    }
  }

  async getData(key: any) {
    return await this.redisConnection().get(key);
  }
}
