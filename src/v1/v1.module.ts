import { Module, MiddlewareConsumer } from '@nestjs/common'
import { UserModule } from './User/user.module'
import { AuthModule } from './Auth/auth.module'
import { CategoryModule } from './Category/category.module'
import { EntryModule } from './Entry/entry.module'
import { ProductModule } from './Product/product.module'

import { BlacklistMiddleware } from '../shared/Middleware/blacklist.middleware'
import { RedisService } from '../shared/Services/redis.service'

@Module({
    imports: [
        UserModule,
        AuthModule,
        CategoryModule,
        EntryModule,
        ProductModule,
    ],
    providers: [RedisService],
})

export class V1Module {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(BlacklistMiddleware).forRoutes('v1/auth/me', 'v1/auth/signout')
    }
}
