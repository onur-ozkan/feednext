// Nest dependencies
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Other dependencies
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-fastify-rate-limiter'

// Local files
import { TitlesEntity } from 'src/shared/Entities/titles.entity'
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { TitleService } from './Service/title.service'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { TitleController } from './Controller/title.controller'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { AwsService } from 'src/shared/Services/aws.service'
import { RolesGuard } from 'src/shared/Guards/roles.guard'
import { configService } from 'src/shared/Services/config.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TitlesEntity, TitlesRepository, CategoriesRepository, UsersRepository, EntriesRepository
        ]),
        RateLimiterModule.register(configService.getGlobalRateLimitations()),
    ],
    controllers: [TitleController],
    providers: [
        TitleService,
        AwsService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RateLimiterInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    exports: [TitleService]
})

export class TitleModule {}
