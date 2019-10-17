
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/users.entity';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) { }

  private get(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.get(k, true));
    return this;
  }

  public getPort() {
    return this.get('APP_PORT', true);
  }

  public isProduction() {
    const mode = this.get('MODE', false);
    return mode !== 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',

      host: this.get('DB_HOST'),
      database: this.get('DB_NAME'),
      synchronize: true,

      entities: [User],
      // migrationsTableName: 'migration',
      // migrations: ['../migration/*.ts'],
      // cli: {migrationsDir: '../migration'},

      ssl: this.isProduction(),
    };
  }
}

const databaseService = new ConfigService(process.env)
  .ensureValues([
    'DB_HOST',
    'DB_NAME',
  ]);

const configService = new ConfigService(process.env);

export { databaseService, configService };
