// Nest dependencies
import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Local files
import { EntriesEntity } from 'src/shared/Entities/entries.entity'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { EntryService } from './Service/entry.service'
import { EntryController } from './Controller/entry.controller'
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { RolesGuard } from 'src/shared/Guards/roles.guard'

@Module({
    imports: [
        TypeOrmModule.forFeature([EntriesEntity, EntriesRepository, TitlesRepository, UsersRepository])
    ],
    controllers: [EntryController],
    providers: [
        EntryService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    exports: [EntryService]
})

export class EntryModule {}
