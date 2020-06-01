// Nest dependencies
import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Local files
import { CategoriesEntity } from 'src/shared/Entities/categories.entity'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { CategoryService } from './Service/category.service'
import { CategoryController } from './Controller/category.controller'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { RolesGuard } from 'src/shared/Guards/roles.guard'

@Module({
    imports: [
        TypeOrmModule.forFeature([CategoriesEntity, CategoriesRepository, EntriesRepository, TitlesRepository])
    ],
    controllers: [CategoryController],
    providers: [
        CategoryService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    exports: [CategoryService]
})

export class CategoryModule {}
