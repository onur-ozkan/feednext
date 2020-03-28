// Nest dependencies
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Local files
import { TitlesEntity } from 'src/shared/Entities/titles.entity'
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { TitleService } from './Service/title.service'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { TitleController } from './Controller/title.controller'

@Module({
    imports: [TypeOrmModule.forFeature([TitlesEntity, TitlesRepository, CategoriesRepository])],
    providers: [TitleService],
    exports: [TitleService],
    controllers: [TitleController],
})

export class TitleModule {}
