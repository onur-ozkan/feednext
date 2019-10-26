import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { databaseService } from './shared/Config/config.service';
import { AuthModule } from './auth/auth.module';
import { BlacklistMiddleware } from './shared/Middleware/blacklist.middleware';
import { RedisService } from './shared/Redis/redis.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(databaseService.getTypeOrmConfig()),
    AuthModule,
  ],
  providers: [RedisService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BlacklistMiddleware).forRoutes('auth/me', 'auth/signout');
  }
}
