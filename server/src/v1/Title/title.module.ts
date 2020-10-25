// Nest dependencies
import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Local files
import { TitlesEntity } from 'src/shared/Entities/titles.entity'
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { TitleService } from './Service/title.service'
import { TitleController } from './Controller/title.controller'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { TagsRepository } from 'src/shared/Repositories/tags.repository'
import { AwsService } from 'src/shared/Services/aws.service'
import { RolesGuard } from 'src/shared/Guards/roles.guard'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TitlesEntity, TagsRepository, TitlesRepository, UsersRepository, EntriesRepository
        ])
    ],
    controllers: [TitleController],
    providers: [
        TitleService,
        AwsService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    exports: [TitleService]
})

export class TitleModule {}
