import { Module } from '@nestjs/common'
import { UsersService } from './Service/users.service'
import { UsersController } from './Controller/users.controller'
import { UserEntity } from '../../shared/Entities/users.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '../../shared/Services/config.service'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersService, ConfigService],
    exports: [UsersService],
    controllers: [UsersController],
})

export class UsersModule {}
