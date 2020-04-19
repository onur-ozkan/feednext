// Nest dependencies
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Local files
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { ConfigService } from 'src/shared/Services/config.service'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { UserService } from './Service/user.service'
import { UsersController } from './Controller/user.controller'
import { MailService } from 'src/shared/Services/mail.service'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, UsersRepository, EntriesRepository])],
    providers: [UserService, ConfigService, MailService],
    exports: [UserService],
    controllers: [UsersController],
})

export class UserModule {}
