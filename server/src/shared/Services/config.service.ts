// Nest dependencies
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

// Other dependencies
import * as env from 'dotenv'

// Local files
import { UsersEntity } from '../Entities/users.entity'
import { EntriesEntity } from '../Entities/entries.entity'
import { TitlesEntity } from '../Entities/titles.entity'
import { ConversationsEntity } from '../Entities/conversations.entity'
import { MessagesEntity } from '../Entities/messages.entity'
import { TagsEntity } from '../Entities/tags.entity'

env.config()

export class ConfigService {

    public getEnv(key: string): any {
        return process.env[key]
    }

    public isProduction(): boolean {
        return this.getEnv('MODE') === 'PROD'
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'mongodb',

            host: this.getEnv('DB_HOST'),
            database: this.getEnv('DB_NAME'),
            synchronize: true,
            useUnifiedTopology: true,
            entities: [
                UsersEntity, TagsEntity, TitlesEntity, EntriesEntity, ConversationsEntity, MessagesEntity
            ],
            ssl: false,
        }
    }
}

export const configService = new ConfigService()
