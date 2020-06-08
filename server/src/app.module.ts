// Nest dependencies
import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RouterModule } from 'nest-router'

// Other dependencies
import { RavenInterceptor } from 'nest-raven'
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-fastify-rate-limiter'

// Local files
import { versionRoutes } from 'src/version.routes'
import { configService } from 'src/shared/Services/config.service'
import { RedisService } from 'src/shared/Services/redis.service'
import { V1Module } from './v1/v1.module'
import { SitemapModule } from './sitemap/sitemap.module'

@Module({
    imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        RouterModule.forRoutes(versionRoutes),
        RateLimiterModule.register(configService.getGlobalRateLimitations()),
        SitemapModule,
        V1Module,
    ],
    providers: [
        RedisService,
        {
            provide: APP_INTERCEPTOR,
            useValue: new RavenInterceptor()
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: RateLimiterInterceptor,
        },
    ],
})

export class AppModule {}
