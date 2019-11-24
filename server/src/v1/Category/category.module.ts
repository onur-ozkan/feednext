import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesEntity } from 'src/shared/Entities/categories.entity'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { CategoryService } from './Service/category.service'
import { CategoryController } from './Controller/category.controller'

@Module({
    imports: [TypeOrmModule.forFeature([CategoriesEntity, CategoriesRepository])],
    providers: [CategoryService],
    exports: [CategoryService],
    controllers: [CategoryController],
})

export class CategoryModule {}
