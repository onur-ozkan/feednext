// Nest dependencies
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Local files
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { ConversationsRepository } from 'src/shared/Repositories/conversations.repository'
import { MessagesRepository } from 'src/shared/Repositories/messages.repository'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'

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
            // updates updated_at value to sort conversations by time
            await this.conversationsRepository.save(conversation)
        } else {
            const newConversation = await this.conversationsRepository.createConversation([from, recipient])
            await this.messagesRepository.createMessage({ conversationId: String(newConversation._id), text: body })
        }
    }

    async getConversationListByUsername (username: string, skip: string): Promise<ISerializeResponse>  {
        const result = await this.conversationsRepository.getConversationListByUsername(username, skip)
        return serializerService.serializeResponse('user_conversation_list', result)
    }
}
