// Nest dependencies
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Local files
import { CategoriesEntity } from 'src/shared/Entities/categories.entity'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { CategoryService } from './Service/category.service'
import { CategoryController } from './Controller/category.controller'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { TitlesRepository } from 'src/shared/Repositories/title.repository'

@Module({
    imports: [TypeOrmModule.forFeature([CategoriesEntity, CategoriesRepository, EntriesRepository, TitlesRepository])],
    providers: [CategoryService],
    exports: [CategoryService],
    controllers: [CategoryController],
})

export class CategoryModule {}
