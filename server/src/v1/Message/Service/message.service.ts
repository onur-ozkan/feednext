// Nest dependencies
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { ConversationsRepository } from 'src/shared/Repositories/conversations.repository'
import { MessagesRepository } from 'src/shared/Repositories/messages.repository'

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
        @InjectRepository(ConversationsRepository)
        private readonly conversationsRepository: ConversationsRepository,
        @InjectRepository(MessagesRepository)
        private readonly messagesRepository: MessagesRepository,
    ) {}

    async sendMessage({ recipient, body, from } : { recipient: string, body: string, from: string }) {
        await this.usersRepository.findOneOrFail({ username: recipient })
        const conversation = await this.conversationsRepository.getConversationByParticipants(from, recipient)
            // tslint:disable-next-line:no-empty
            .catch(_error => {})
        if (conversation) {
            await this.messagesRepository.createMessage({ conversationId: String(conversation._id), text: body })
        } else {
            const newConversation = await this.conversationsRepository.createConversation([from, recipient])
            await this.messagesRepository.createMessage({ conversationId: String(newConversation._id), text: body })
        }
    }
}
