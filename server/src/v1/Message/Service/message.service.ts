// Nest dependencies
import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Other dependencies
import { Validator } from 'class-validator'

// Local files
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { ConversationsRepository } from 'src/shared/Repositories/conversations.repository'
import { MessagesRepository } from 'src/shared/Repositories/messages.repository'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'

@Injectable()
export class MessageService {

    private validator: Validator

    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
        @InjectRepository(ConversationsRepository)
        private readonly conversationsRepository: ConversationsRepository,
        @InjectRepository(MessagesRepository)
        private readonly messagesRepository: MessagesRepository,
    ) {
        this.validator = new Validator()
    }

    async sendMessage({ recipient, body, from } : { recipient: string, body: string, from: string }): Promise<void> {
        await this.usersRepository.findOneOrFail({ username: recipient })
        const conversation = await this.conversationsRepository.getConversationByParticipants(from, recipient)
            // tslint:disable-next-line:no-empty
            .catch(_error => {})
        if (conversation) {
            await this.messagesRepository.createMessage({
                conversationId: String(conversation._id),
                sendBy: from,
                text: body
            })
            // updates updated_at value to sort conversations by time
            conversation.unread_messages[recipient]++
            conversation.last_message_send_at = new Date()
            await this.conversationsRepository.save(conversation)
        } else {
            const newConversation = await this.conversationsRepository.createConversation([from, recipient])
            await this.messagesRepository.createMessage({
                conversationId: String(newConversation._id),
                sendBy: from,
                text: body
            })
            await this.conversationsRepository.increaseUnreadMessageCount(from, recipient)
        }
    }

    async getConversationListByUsername (username: string, skip: string): Promise<ISerializeResponse>  {
        const result = await this.conversationsRepository.getConversationListByUsername(username, skip)
        return serializerService.serializeResponse('user_conversation_list', result)
    }

    async getUnreadMessageInfo (username: string): Promise<ISerializeResponse> {
        try {
            await this.usersRepository.findOneOrFail({ username })
        } catch (error) {
            throw new BadRequestException('User does not exist')
        }

        const [conversations] = await this.conversationsRepository.findAndCount({
            where: {
                participants: { $in: [username] }
            }
        })

        const unReadValueWithConvId: { id: string, value: number }[] = conversations.map(conv => {
            return {
                id: String(conv._id),
                value: conv.unread_messages[username],
            }
        })

        const result = {
            values_by_conversations: unReadValueWithConvId,
            total_unread_value: unReadValueWithConvId.reduce((previous, current) => previous + current.value, 0)
        }

        return serializerService.serializeResponse('user_unread_message_info', result)
    }

    async getMessageListByConversationId (username: string, conversationId: string, skip: string): Promise<ISerializeResponse>  {
        if (!this.validator.isMongoId(conversationId)) throw new BadRequestException('Conversation id must be a MongoId')
        await this.conversationsRepository.verifyUserAccessToConversation(username, conversationId)
        await this.conversationsRepository.resetUnreadMessageCount(username, conversationId)

        const result = await this.messagesRepository.getMessageListByConversationId(conversationId, skip)
        return serializerService.serializeResponse('conversation_message_list', result)
    }

    async deleteMessages(conversationId: string, username: string): Promise<HttpException> {
        if (!this.validator.isMongoId(conversationId)) throw new BadRequestException('Conversation id must be a MongoId')

        await this.conversationsRepository.deleteConversation(conversationId, username)
        await this.messagesRepository.deleteMessagesBelongsToConversation(conversationId)

        throw new HttpException('Messages successfully deleted', HttpStatus.OK)
    }
}
