// Nest Dependencies
import { BadRequestException } from '@nestjs/common'

// Other dependencies
import { Repository, EntityRepository } from 'typeorm'
import { ObjectId } from 'mongodb'

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

    async increaseUnreadMessageCount(sender: string, recipient: string): Promise<void> {
        const conversation = await this.findOneOrFail({
            where: {
                $or: [
                    { participants: [sender, recipient] },
                    { participants: [recipient, sender] }
                ]
            }
        })

        conversation.unread_messages[0].username === recipient ? conversation.unread_messages[0].value++
            : conversation.unread_messages[1].value++
        await this.save(conversation)
    }

    async resetUnreadMessageCount(username: string, conversationId: string): Promise<void> {
        const conversation = await this.findOneOrFail(conversationId)

        conversation.unread_messages[0].username === username ? conversation.unread_messages[0].value = 0
            : conversation.unread_messages[1].value = 0
        await this.save(conversation)
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
                    participants: { $in: [username] },
                    deleted_from: { $nin: [username] }
                }
            })
        } catch (error) {
            throw new BadRequestException('User does not have access to the conversation or conversation does not exist')
        }
    }

    async getConversationListByUsername(username: string, skip: string): Promise<{ conversations: ConversationsEntity[], count: number }> {
        const [conversations, total] = await this.findAndCount({
            where: {
                participants: { $in: [username] },
                deleted_from: { $nin: [username] }
            },
            order: {
                last_message_send_at: 'DESC',
            },
            take: 10,
            skip: Number(skip) || 0,
        })

        return { conversations, count: total }
    }

    async deleteConversation(conversationId: string, username: string): Promise<boolean> {
        let conversation: ConversationsEntity
        let isDeleted = false
        try {
            conversation = await this.findOneOrFail({
                where: {
                    _id: ObjectId(conversationId),
                    participants: { $in: [username] }
                }
            })
        } catch (err) {
            throw new BadRequestException('Conversation could not found by giving id and username')
        }

        if (conversation.deleted_from.length < (conversation.participants.length - 1)) {
            conversation.deleted_from.push(username)
            await this.save(conversation)
        } else {
            isDeleted = true
            await this.delete(conversation)
        }

        return isDeleted
    }
}
