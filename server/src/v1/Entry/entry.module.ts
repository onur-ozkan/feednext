// Nest dependencies
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Local files
import { EntriesEntity } from 'src/shared/Entities/entries.entity'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { EntryService } from './Service/entry.service'
import { EntryController } from './Controller/entry.controller'
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { UsersRepository } from 'src/shared/Repositories/users.repository'

@Module({
    imports: [TypeOrmModule.forFeature([EntriesEntity, EntriesRepository, TitlesRepository, UsersRepository])],
    providers: [EntryService],
    exports: [EntryService],
    controllers: [EntryController],
})

export class EntryModule {}
