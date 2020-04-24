// Nest dependencies
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common'

// Other dependencies
import { Repository, EntityRepository } from 'typeorm'
import { ObjectId } from 'mongodb'

// Local files
import { EntriesEntity } from '../Entities/entries.entity'
import { CreateEntryDto } from 'src/v1/Entry/Dto/create-entry.dto'

@EntityRepository(EntriesEntity)
export class EntriesRepository extends Repository<EntriesEntity> {
    async getEntry(entryId: string): Promise<EntriesEntity> {
        try {
            const entry: EntriesEntity = await this.findOneOrFail(entryId)
            return entry
        } catch (err) {
            throw new BadRequestException('Entry with that id could not found in the database.')
        }
    }

    async getVotedEntriesByIds({ idList, query }: {
        idList: ObjectId[],
        query: { limit: number, skip: number }
    }): Promise<{ entries: EntriesEntity[], count: number }> {
        const [entries, total] = await this.findAndCount({
            where: {
                '_id': { $in: idList }
            },
            order: {
                created_at: 'DESC',
            },
            take: Number(query.limit) || 10,
            skip: Number(query.skip) || 0,
        })

        return { entries, count: total }
    }

    async getEntriesByTitleSlug({ titleSlug, query }: {
        titleSlug: string, query: { limit: number, skip: number }
    }): Promise<{ entries: EntriesEntity[], count: number }> {
        const [entries, total] = await this.findAndCount({
            where: {
                title_slug: titleSlug
            },
            order: {
                created_at: 'ASC',
            },
            take: Number(query.limit) || 10,
            skip: Number(query.skip) || 0,
        })

        return { entries, count: total }
    }

    async getEntriesByAuthorOfIt({ username, query }: {
        username: string, query: { limit: number, skip: number }
    }): Promise<{ entries: EntriesEntity[], count: number }> {
        const [entries, total] = await this.findAndCount({
            where: {
                written_by: username
            },
            order: {
                created_at: 'DESC',
            },
            take: Number(query.limit) || 10,
            skip: Number(query.skip) || 0,
        })

        return { entries, count: total }
    }

    async getLatestEntries(): Promise<{ entries: EntriesEntity[], count: number }> {
        const [entries, total] = await this.findAndCount({
            order: {
                created_at: 'DESC',
            },
            skip: 0,
            take: 250,
        })

        return { entries, count: total }
    }

    async getFeaturedEntryByTitleSlug({ titleSlug }: { titleSlug: string }): Promise<EntriesEntity> {
        try {
            const entries = await this.findOneOrFail({
                where: {
                    title_slug: titleSlug
                },
                order: {
                    votes: 'DESC',
                }
            })

            return entries

        } catch (err) {
            throw new BadRequestException('No entry found for given titleSlug')
        }
    }

    async createEntry(writtenBy: string, dto: CreateEntryDto): Promise<EntriesEntity> {
        const newTitle: EntriesEntity = new EntriesEntity({
            text: dto.text,
            title_slug: dto.titleSlug,
            written_by: writtenBy,
        })

        try {
            return await this.save(newTitle)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }
    }

    async updateEntry(updatedBy: string, entryId: string, text: string): Promise<EntriesEntity> {
        if (!text) throw new BadRequestException('Entry text can not be null.')

        let entry: EntriesEntity
        try {
            entry = await this.findOneOrFail(entryId)
        } catch {
            throw new BadRequestException('Entry with that id could not found in the database.')
        }

        try {
            entry.text = text
            entry.updated_by = updatedBy

            await this.save(entry)
            return entry
        } catch (err) {
            throw new BadRequestException(err.errmsg)
        }
    }

    async voteEntry({ entryId, isUpVoted }: { entryId: string, isUpVoted: boolean }): Promise<void> {
        const entry: EntriesEntity = await this.findOneOrFail(entryId)
        isUpVoted ? entry.votes++ : entry.votes--
        this.save(entry)
    }

    async deleteEntry(entryId: string): Promise<EntriesEntity> {
        try {
            const entry: EntriesEntity = await this.findOneOrFail(entryId)
            await this.delete(entry)
            return entry
        } catch (err) {
            throw new BadRequestException('Entry with that id could not found in the database.')
        }
    }

    async deleteEntriesBelongsToTitle(titleSlug: string): Promise<void> {
        const entries: any = await this.find({ title_slug: titleSlug })
        await this.delete(entries)
    }
}
