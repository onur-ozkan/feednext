// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

// Local files
import { MessagesEntity } from '../Entities/messages.entity'

@EntityRepository(MessagesEntity)
export class MessagesRepository extends Repository<MessagesEntity> {

    async createMessage({ conversationId, text, sendBy }: {
        conversationId: string,
        text: string,
        sendBy: string
    }) {
        const newMessage: MessagesEntity = new MessagesEntity({
            conversation_id: conversationId,
            send_by: sendBy,
            text
        })

        await this.save(newMessage)
    }

    async getMessageListByConversationId(conversationId: string, skip: string): Promise<{ messages: MessagesEntity[], count: number }> {
        const [messages, total] = await this.findAndCount({
            where: {
                conversation_id: conversationId
            },
            order: {
                created_at: 'DESC'
            },
            take: 10,
            skip: Number(skip) || 0
        })

        return { messages, count: total }
    }

    async deleteMessagesBelongsToConversation(conversationId: string): Promise<void> {
        const messages: any = await this.find({ conversation_id: conversationId })
        await this.remove(messages)
    }

}
