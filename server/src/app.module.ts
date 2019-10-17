import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { EntriesModule } from './entries/entries.module';
import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { CategoriesController } from './categories/categories.controller';
import { ProductsController } from './products/products.controller';
import { EntriesController } from './entries/entries.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { CategoriesService } from './categories/categories.service';
import { ProductsService } from './products/products.service';
import { EntriesService } from './entries/entries.service';
import { User } from './users/users.entity';
import { databaseService } from './config/config.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(databaseService.getTypeOrmConfig()),

  ],
})

export class AppModule {}
