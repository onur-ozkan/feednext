import { Module, MiddlewareConsumer } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { CategoriesModule } from './categories/categories.module'
import { EntriesModule } from './entries/entries.module'
import { ProductsModule } from './products/products.module'

import { BlacklistMiddleware } from '../shared/Middleware/blacklist.middleware'
import { RedisService } from '../shared/Redis/redis.service'

@Module({
    imports: [
        UsersModule,
        AuthModule,
        CategoriesModule,
        EntriesModule,
        ProductsModule,
    ],
    providers: [RedisService],
})

export class ApiModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(BlacklistMiddleware).forRoutes('v1/auth/me', 'v1/auth/signout')
    }
}
