
import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => await createConnection({
      type: 'mongodb',
      host: config.get('DB_HOST'),
      database: config.get('DB_NAME'),
      entities: [],
      synchronize: true,
    }),
  },
];
