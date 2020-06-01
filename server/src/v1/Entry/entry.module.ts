// Nest dependencies
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Other dependencies
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-fastify-rate-limiter'

// Local files
import { EntriesEntity } from 'src/shared/Entities/entries.entity'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { EntryService } from './Service/entry.service'
import { EntryController } from './Controller/entry.controller'
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { RolesGuard } from 'src/shared/Guards/roles.guard'
import { configService } from 'src/shared/Services/config.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([EntriesEntity, EntriesRepository, TitlesRepository, UsersRepository]),
        RateLimiterModule.register(configService.getGlobalRateLimitations())
    ],
    controllers: [EntryController],
    providers: [
        EntryService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RateLimiterInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    exports: [EntryService]
})

export class EntryModule {}
