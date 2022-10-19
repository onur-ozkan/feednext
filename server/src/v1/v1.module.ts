// Nest dependencies
import { Module, MiddlewareConsumer } from '@nestjs/common'

// Local files
import { BlacklistMiddleware } from 'src/shared/Middleware/blacklist.middleware'
import { RedisService } from 'src/shared/Services/redis.service'
import { AuthModule } from './Auth/auth.module'
import { UserModule } from './User/user.module'
import { TagModule } from './Tag/tag.module'
import { TitleModule } from './Title/title.module'
import { EntryModule } from './Entry/entry.module'
import { MessageModule } from './Message/message.module'

@Module({
    imports: [
        AuthModule,
        UserModule,
        TagModule,
        TitleModule,
        EntryModule,
        MessageModule
    ],
    providers: [RedisService],
})

export class V1Module {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(BlacklistMiddleware).forRoutes('v1/auth/check-token', 'v1/auth/signout')
    }
}
