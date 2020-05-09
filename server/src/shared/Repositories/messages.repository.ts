// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

// Local files
import { MessagesEntity } from '../Entities/messages.entity'

@EntityRepository(MessagesEntity)
export class MessagesRepository extends Repository<MessagesEntity> {
    async createMessage({ conversationId, text }: { conversationId: string, text: string }) {
        const newMessage: MessagesEntity = new MessagesEntity({
            conversation_id: conversationId,
            text
        })

        await this.save(newMessage)
    }

}
