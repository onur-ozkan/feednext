// Nest dependencies
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Local files
import { MessageService } from './Service/message.service'
import { MessageController } from './Controller/message.controller'
import { MessageGateway } from './Gateway/message.gateway'
import { MessagesRepository } from 'src/shared/Repositories/messages.repository'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { ConversationsRepository } from 'src/shared/Repositories/conversations.repository'

@Module({
    imports: [TypeOrmModule.forFeature([MessagesRepository, ConversationsRepository, UsersRepository])],
    controllers: [MessageController],
    providers: [MessageService, MessageGateway],
    exports: [MessageService]
})

export class MessageModule {}
