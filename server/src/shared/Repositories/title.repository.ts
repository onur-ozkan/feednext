// Nest dependencies
import { UnprocessableEntityException, BadRequestException, NotFoundException } from '@nestjs/common'

// Other dependencies
import { Repository, EntityRepository } from 'typeorm'
import { ObjectId } from 'mongodb'
import slugify from 'slugify'

// Local files
import { TitlesEntity } from '../Entities/titles.entity'
import { CreateTitleDto } from 'src/v1/Title/Dto/create-title.dto'
import { UpdateTitleDto } from 'src/v1/Title/Dto/update-title.dto'

@EntityRepository(TitlesEntity)
export class TitlesRepository extends Repository<TitlesEntity> {
    async getTitleBySlug(titleSlug: string): Promise<TitlesEntity> {
        try {
            const title: TitlesEntity = await this.findOneOrFail({ slug: titleSlug })
            return title
        } catch (err) {
            throw new NotFoundException('Title could not found by given slug')
        }
    }

    async getTitleById(titleId: string): Promise<TitlesEntity> {
        try {
            const title: TitlesEntity = await this.findOneOrFail(titleId)
            return title
        } catch (err) {
            throw new NotFoundException('Title could not found by given id')
        }
    }

    async searchTitle({ searchValue }: { searchValue: string }): Promise<{ titles: TitlesEntity[] }> {
        const [titles] = await this.findAndCount({
            where: {
                name: new RegExp(searchValue, 'i')
            },
            take: 5,
            order: {
                entry_count: 'DESC'
            }
        })

        return { titles }
    }

    async updateEntryCount(titleId: ObjectId, value: number): Promise<void> {
        try {
            const title: TitlesEntity = await this.findOneOrFail(titleId)
            title.entry_count += value
            this.save(title)
        } catch (err) {
            throw new NotFoundException('Title could not found by given id')
        }
    }

    async getTitleList(
        query: {
            author: string,
            tags: string[],
            sortBy: 'hot' | 'top',
            skip: number,
        }
    ): Promise<{ titles: TitlesEntity[], count: number }> {
        const [titles, total] = await this.findAndCount({
            where: {
                ...query.author && {
                    opened_by: query.author
                },
                ...query.tags && {
                    tags: {
                        $in: query.tags
                    }
                },
                ...query.sortBy === 'hot' && {
                    created_at: {
                        // Query for last 24 hours
                        $gte: new Date(new Date().setDate(new Date().getDate() - 1))
                    }
                },
            },
            order: {
                ...query.sortBy === undefined && {
                    created_at: 'DESC',
                },
                ...(query.sortBy === 'top' || query.sortBy === 'hot') && {
                    entry_count: 'DESC',
                }
            },
            take: 10,
            skip: Number(query.skip) || 0,
        })

        return { titles, count: total }
    }

    async getTitleListByIds(idList: ObjectId[]): Promise<{ titles: TitlesEntity[], count: number }> {
        const [titles, total] = await this.findAndCount({
            where: {
                '_id': {
                    $in: idList
                }
            },
            order: {
                entry_count: 'DESC'
            },
            take: 5,
            skip: 0,
        })

        return { titles, count: total }
    }

    async createTitle(openedBy: string, dto: CreateTitleDto): Promise<TitlesEntity> {
        const newTitle: TitlesEntity = new TitlesEntity({
            name: dto.name,
            slug: slugify(dto.name, { lower: true }),
            tags: dto.tags,
            opened_by: openedBy,
        })

        try {
            return await this.save(newTitle)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }
    }

    async rateTitle(ratedBy: string, titleId: string, rateValue: number): Promise<void> {
        let title
        try {
            title = await this.findOneOrFail(titleId)
        } catch (error) {
            throw new NotFoundException('Title could not found by given id')
        }

        const docIfAlreadyRated = title.rate.find(item => item.username === ratedBy)
        if (docIfAlreadyRated) docIfAlreadyRated.rateValue = rateValue
        else title.rate.push({ username: ratedBy, rateValue })

        this.save(title)
    }

    async getRateOfUser(username: string, titleId: string): Promise<any> {
        let title: TitlesEntity
        try {
            title = await this.findOneOrFail(titleId)
        } catch (error) {
            throw new NotFoundException('Title could not found by given id')
        }

        const userRate: { rateValue: number } | undefined = title.rate.find((
            item: { username: string, rateValue: number }
        ) => item.username === username)

        if (userRate) return userRate!.rateValue
        throw new BadRequestException('This user did not rate this title yet')
    }

    async getAvarageRate(titleId: string): Promise<number> {
        let title: TitlesEntity
        try {
            title = await this.findOneOrFail(titleId)
        } catch (error) {
            throw new NotFoundException('Title could not found by given id')
        }

        const averageRate = title.rate.reduce((
            total,
            next: { username: string, rateValue: number }
        ) => total + next.rateValue, 0) / title.rate.length

        return Math.round(averageRate)
    }

    async updateTitle(updatedBy: string, title: TitlesEntity, dto: UpdateTitleDto): Promise<TitlesEntity> {
        try {
            if (dto.name) {
                title.name = dto.name
                title.slug = slugify(dto.name, { lower: true })
            }
            if (dto.tags) title.tags = dto.tags

            title.updated_by = updatedBy

            await this.save(title)
            return title
        } catch (err) {
            throw new BadRequestException(err.errmsg)
        }
    }

    async deleteTagFromTitle(tagName: string): Promise<void> {
        const titles = await this.find({
            where: {
                tags: { $in: [tagName] }
            }
        })

        titles.map(title => {
            const updatedTagList = title.tags.filter(tag => tag !== tagName)
            title.tags = updatedTagList
            this.save(title)
        })

        return
    }

    async deleteTitle(titleId: string): Promise<void> {
        try {
            const title: TitlesEntity = await this.findOneOrFail(titleId)
            await this.delete(title)
        } catch (err) {
            throw new NotFoundException('Title could not found by given id')
        }
    }
}
