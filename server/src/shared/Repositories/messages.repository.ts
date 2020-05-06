// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

// Local files
import { MessagesEntity } from '../Entities/messages.entity'

@EntityRepository(MessagesEntity)
export class MessagesRepository extends Repository<MessagesEntity> {

}
