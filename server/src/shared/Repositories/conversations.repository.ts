// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

// Local files
import { ConversationsEntity } from '../Entities/conversations.entity'

@EntityRepository(ConversationsEntity)
export class ConversationsRepository extends Repository<ConversationsEntity> {

    async getConversationByParticipants(participantX: string, participantY: string): Promise<ConversationsEntity> {
        const conversation = await this.findOneOrFail({
            where: {
                $or: [
                    { participants: [participantX, participantY] },
                    { participants: [participantY, participantX] }
                ]
            }
        })

        return conversation
    }

    async createConversation(participants: string[]): Promise<ConversationsEntity> {
        const newConversation: ConversationsEntity = new ConversationsEntity({
            participants
        })

        await this.save(newConversation)
        return newConversation
    }
}
