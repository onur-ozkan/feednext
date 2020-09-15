// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

// Local files
import { TagsEntity } from '../Entities/tags.entity'

@EntityRepository(TagsEntity)
export class TagsRepository extends Repository<TagsEntity> {

}