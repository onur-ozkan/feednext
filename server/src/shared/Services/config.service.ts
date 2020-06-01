// Nest dependencies
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

// Other dependencies
import * as env from 'dotenv'

// Local files
import { UsersEntity } from '../Entities/users.entity'
import { CategoriesEntity } from '../Entities/categories.entity'
import { EntriesEntity } from '../Entities/entries.entity'
import { TitlesEntity } from '../Entities/titles.entity'
import { ConversationsEntity } from '../Entities/conversations.entity'
import { MessagesEntity } from '../Entities/messages.entity'

env.config()

export class ConfigService {

    public getEnv(key: string): any {
        return process.env[key]
    }

    public isProduction(): boolean {
        return this.getEnv('MODE') === 'PROD'
    }

    public getGlobalRateLimitations() {
        return {
            type: 'Memory',
            points: this.getEnv('RATE_LIMIT_PER_MIN'),
            duration: 60,
            errorMessage: 'Rate limit exceeded, please try again later',
            keyPrefix: 'global',
        }
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'mongodb',

            host: this.getEnv('DB_HOST'),
            database: this.getEnv('DB_NAME'),
            synchronize: true,
            useUnifiedTopology: true,
            entities: [
                UsersEntity, CategoriesEntity, EntriesEntity, TitlesEntity, ConversationsEntity, MessagesEntity
            ],
            ssl: false,
        }
    }
}

export const configService = new ConfigService()
