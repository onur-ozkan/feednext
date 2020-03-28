// Nest dependencies
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

// Other dependencies
import * as env from 'dotenv'

// Local files
import { UsersEntity } from '../Entities/users.entity'
import { CategoriesEntity } from '../Entities/categories.entity'
import { EntriesEntity } from '../Entities/entries.entity'
import { ProductsEntity } from '../Entities/products.entity'

env.config()

export class ConfigService {

    public getEnv(key: string): any {
        const value = process.env[key]
        if (!value) throw new Error(`Config error. Missing ${key} variable in .env file.`)
        return value
    }

    public isProduction(): boolean {
        return this.getEnv(`MODE`) === `PROD`
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: `mongodb`,

            host: this.getEnv(`DB_HOST`),
            database: this.getEnv(`DB_NAME`),
            synchronize: true,
            useUnifiedTopology: true,
            entities: [UsersEntity, CategoriesEntity, EntriesEntity, ProductsEntity],

            ssl: this.isProduction(),
        }
    }
}

export const configService = new ConfigService()
