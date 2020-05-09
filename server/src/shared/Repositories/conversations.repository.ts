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

    async getConversationListByUsername(username: string, skip: string): Promise<ConversationsEntity[]> {
        const [conversations] = await this.findAndCount({
            where: {
                participants: { $in: [username] }
            },
            order: {
                updated_at: 'DESC',
            },
            take: 10,
            skip: Number(skip) || 0,
        })

        return conversations
    }
}
