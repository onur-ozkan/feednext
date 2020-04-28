// Nest dependencies
import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RouterModule } from 'nest-router'

// Other dependencies

import { RavenInterceptor } from 'nest-raven'

// Local files
import { versionRoutes } from 'src/version.routes'
import { configService } from 'src/shared/Services/config.service'
import { RedisService } from 'src/shared/Services/redis.service'
import { V1Module } from './v1/v1.module'

@Module({
    imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        RouterModule.forRoutes(versionRoutes),
        V1Module,
    ],
    providers: [
        RedisService,
        {
            provide: APP_INTERCEPTOR,
            useValue: new RavenInterceptor()
        }
    ],
})

export class AppModule {}
