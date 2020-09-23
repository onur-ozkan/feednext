// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

// Local files
import { TagsEntity } from '../Entities/tags.entity'

@EntityRepository(TagsEntity)
export class TagsRepository extends Repository<TagsEntity> {

    async tagActionOnTitleCreate(tagName: string): Promise<void> {
        const tag = await this.findOne({ name: tagName })

        if (!tag) {
            this.save({
                name: tagName,
                popularity_ratio: 0.01,
                total_title: 0
            })
        } else {
            // TODO popularity_ratio logic
            tag.total_title++
            this.save(tag)
        }

        return
    }

}