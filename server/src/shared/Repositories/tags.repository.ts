// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

// Local files
import { TagsEntity } from '../Entities/tags.entity'

@EntityRepository(TagsEntity)
export class TagsRepository extends Repository<TagsEntity> {

    async tagActionOnTitleCreate(tagName: string): Promise<void> {
        const tag: any = await this.findOne({ name: tagName })

        if (!tag) {
            this.save({
                name: tagName,
                popularity_ratio: 0.01,
                total_title: 0
            })
        }

        else {
            const diff = new Date().getTime() - tag.updated_at
            const diffAsMin = Math.round((diff / 1000) / 60)

            if (diffAsMin <= 1440 && tag.popularity_ratio < 1.00) tag.popularity_ratio += 0.01
            else tag.popularity_ratio = 0.02

            tag.total_title++
            this.save(tag)
        }

        return
    }

    async deleteTag(tag: TagsEntity): Promise<void> {
        await this.delete(tag)
        return
    }

}