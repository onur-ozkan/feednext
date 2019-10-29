import { Module } from '@nestjs/common'
import { UsersService } from './Service/users.service'
import { UsersController } from './Controller/users.controller'
import { UserEntity } from './Entity/users.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '../shared/Config/config.service'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersService, ConfigService],
    exports: [UsersService],
    controllers: [UsersController],
})

export class UsersModule {}
