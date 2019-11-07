import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './Service/user.service'
import { UsersController } from './Controller/user.controller'
import { UsersEntity } from '../../shared/Entities/users.entity'
import { ConfigService } from '../../shared/Services/config.service'
import { UsersRepository } from '../../shared/Repositories/users.repository'

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, UsersRepository])],
    providers: [UserService, ConfigService],
    exports: [UserService],
    controllers: [UsersController],
})

export class UserModule {}
