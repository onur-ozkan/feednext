// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

// Local files
import { ConversationsEntity } from '../Entities/conversations.entity'
import { ObjectId } from 'mongodb'
import { BadRequestException } from '@nestjs/common'

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

    async verifyUserAccessToConversation(username: string, conversationId: string): Promise<void> {
        try {
            await this.findOneOrFail({
                where: {
                    _id: ObjectId(conversationId),
                    participants: { $in: [username] }
                }
            })
        } catch (error) {
            throw new BadRequestException('User does not have access to the conversation or conversation does not exist')
        }
    }

    async getConversationListByUsername(username: string, skip: string): Promise<{ conversations: ConversationsEntity[], count: number }> {
        const [conversations, total] = await this.findAndCount({
            where: {
                participants: { $in: [username] }
            },
            order: {
                updated_at: 'DESC',
            },
            take: 10,
            skip: Number(skip) || 0,
        })

        return { conversations, count: total }
    }

    async deleteConversation(conversationId: string, username: string): Promise<void> {
        try {
            const conversation: ConversationsEntity = await this.findOneOrFail({
                where: {
                    _id: ObjectId(conversationId),
                    participants: { $in: [username] }
                }
            })
            await this.delete(conversation)
        } catch (err) {
            throw new BadRequestException('Conversation could not found by giving id and username')
        }
    }
}
