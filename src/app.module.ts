import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

import { databaseService } from './shared/config/config.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(databaseService.getTypeOrmConfig()),
  ],
})

export class AppModule {}
