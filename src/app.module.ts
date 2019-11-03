import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RouterModule } from 'nest-router'
import { versionRoutes } from './version.routes'
import { databaseService } from './shared/Services/config.service'
import { RedisService } from './shared/Services/redis.service'
import { ApiModule } from './v1/api.module'

@Module({
    imports: [
        TypeOrmModule.forRoot(databaseService.getTypeOrmConfig()),
        RouterModule.forRoutes(versionRoutes),
        ApiModule,
    ],
    providers: [RedisService],
})

export class AppModule {}
