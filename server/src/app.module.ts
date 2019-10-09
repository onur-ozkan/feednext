import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
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

@Module({
  imports: [
    ConfigModule, CategoriesModule, ProductsModule, EntriesModule, UsersModule,
  ],
  controllers: [AppController, UsersController, CategoriesController, ProductsController, EntriesController],
  providers: [AppService, UsersService, CategoriesService, ProductsService, EntriesService],
})

export class AppModule {}
