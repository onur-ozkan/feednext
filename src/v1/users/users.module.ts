import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from './Service/users.service'
import { UsersController } from './Controller/users.controller'
import { UserEntity } from '../../shared/Entities/users.entity'
import { ConfigService } from '../../shared/Services/config.service'
import { UserRepository } from '../../shared/Repositories/user.repository'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, UserRepository])],
    providers: [UsersService, ConfigService],
    exports: [UsersService],
    controllers: [UsersController],
})

export class UsersModule {}
