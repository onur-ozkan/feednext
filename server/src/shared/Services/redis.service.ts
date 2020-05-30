// Other dependencies
import * as Redis from 'ioredis'

// Local files
import { configService } from './config.service'

export class RedisService {
    private redisConnection() {
        return new Redis({
            host: configService.getEnv('REDIS_HOST'),
            port: configService.getEnv('REDIS_PORT'),
            password: configService.getEnv('REDIS_PASSWORD'),
        })
    }

    async setData(key: string, value: any, expireTime?: number) {
        if (expireTime) {
            await this.redisConnection().set(key, value, 'EX', expireTime)
        } else {
            await this.redisConnection().set(key, value)
        }
    }

    async setOnlyKey(key: string, expireTime?: number) {
        if (expireTime) {
            await this.redisConnection().set(key, null, 'EX', expireTime)
        } else {
            await this.redisConnection().set(key, null)
        }
    }

    async getData(key: any) {
        return await this.redisConnection().get(key)
    }

    async deleteData(key: string) {
        await this.redisConnection().del(key)
    }
}
