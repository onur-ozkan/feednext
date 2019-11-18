import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { UsersEntity } from '../Entities/users.entity'

// tslint:disable-next-line:no-var-requires
require('dotenv').config()

export class ConfigService {
    constructor(private env: { [k: string]: string | undefined }) {}

    public get(key: string, throwOnMissing = true): any {
        const value = this.env[key]
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`)
        }

        return value
    }

    public ensureValues(keys: string[]): any {
        keys.forEach(k => this.get(k, true))
        return this
    }

    public isProduction(): boolean {
        const mode = this.get('MODE', false)
        return mode === 'PROD'
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'mongodb',

            host: this.get('DB_HOST'),
            database: this.get('DB_NAME'),
            synchronize: true,
            useUnifiedTopology: true,
            entities: [UsersEntity],

            ssl: this.isProduction(),
        }
    }
}

const databaseService = new ConfigService(process.env).ensureValues([
    'DB_HOST',
    'DB_NAME',
])

const configService = new ConfigService(process.env)

export { databaseService, configService }
