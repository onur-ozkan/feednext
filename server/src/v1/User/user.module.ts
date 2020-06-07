// Nest dependencies
import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Local files
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { UserService } from './Service/user.service'
import { UsersController } from './Controller/user.controller'
import { MailService } from 'src/shared/Services/mail.service'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { AwsService } from 'src/shared/Services/aws.service'
import { RolesGuard } from 'src/shared/Guards/roles.guard'

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity, UsersRepository, EntriesRepository])
    ],
    controllers: [UsersController],
    providers: [
        UserService,
        MailService,
        AwsService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    exports: [UserService]
})

export class UserModule {}
