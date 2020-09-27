// Nest dependencies
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Local files
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { TagsRepository } from 'src/shared/Repositories/tags.repository'
import { TagController } from './tag.controller'
import { TagService } from './tag.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TagsRepository,
            TitlesRepository
        ])
    ],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService]
})

export class TagModule {}
