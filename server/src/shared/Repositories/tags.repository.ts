// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

// Local files
import { TagsEntity } from '../Entities/tags.entity'

@EntityRepository(TagsEntity)
export class TagsRepository extends Repository<TagsEntity> {

    async getTrendingTags(): Promise<{ tags: TagsEntity[], count: number }> {
        const [tags, total] = await this.findAndCount({
            where: {
                updated_at: {
                    // Last 24 hours
                    $gte: new Date(new Date().setDate(new Date().getDate() - 1))
                }
            },
            order: {
                popularity_ratio: 'DESC',
                updated_at: 'DESC'
            },
            take: 30,
            skip: 0,
        })

        return { tags, count: total }
    }

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