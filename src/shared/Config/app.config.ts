
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../../users/Entity/users.entity';

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

  public ensureValues(keys: string[]): any {
    keys.forEach(k => this.get(k, true));
    return this;
  }

  public getPort(): any {
    return this.get('APP_PORT', true);
  }

  public getSecretKey(): any {
    return this.get('SECRET_KEY', true);
  }

  public getLogLevel(): any {
    return this.get('LOG_LEVEL', true);
  }

  public getJwtExpireTime(): any {
    return this.get('JWT_EXPIRATION_TIME', true);
  }

  public getAppUrl(): any {
    return this.get('APP_URL', true);
  }

  public get apmAccount(): any {
    return {
      username: this.get('APM_USERNAME'),
      password: this.get('APM_PASSWORD'),
    };
  }

  public isProduction(): any {
    const mode = this.get('MODE', false);
    return mode !== 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',

      host: this.get('DB_HOST'),
      database: this.get('DB_NAME'),
      synchronize: true,
      useUnifiedTopology: true,
      entities: [UserEntity],

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
