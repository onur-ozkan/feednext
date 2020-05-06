// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

// Local files
import { ConversationsEntity } from '../Entities/conversations.entity'

@EntityRepository(ConversationsEntity)
export class ConversationsRepository extends Repository<ConversationsEntity> {

}
