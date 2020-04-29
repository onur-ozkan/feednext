// Nest dependencies
import { BadRequestException, UnprocessableEntityException, ForbiddenException } from '@nestjs/common'

// Other dependencies
import { Repository, EntityRepository } from 'typeorm'
import { ObjectId } from 'mongodb'

// Local files
import { EntriesEntity } from '../Entities/entries.entity'
import { CreateEntryDto } from 'src/v1/Entry/Dto/create-entry.dto'
import { Role } from '../Enums/Roles'

@EntityRepository(EntriesEntity)
export class EntriesRepository extends Repository<EntriesEntity> {
    async getEntry(entryId: string): Promise<EntriesEntity> {
        try {
            const entry: EntriesEntity = await this.findOneOrFail(entryId)
            return entry
        } catch (err) {
            throw new BadRequestException('Entry could not found by given id')
        }
    }

    async getVotedEntriesByIds({ idList, query }: {
        idList: ObjectId[],
        query: { skip: number }
    }): Promise<{ entries: EntriesEntity[], count: number }> {
        const [entries, total] = await this.findAndCount({
            where: {
                '_id': { $in: idList }
            },
            order: {
                created_at: 'DESC',
            },
            take: 10,
            skip: Number(query.skip) || 0,
        })

        return { entries, count: total }
    }

    async getEntriesByTitleId({ titleId, query }: {
        titleId: string, query: { skip: number }
    }): Promise<{ entries: EntriesEntity[], count: number }> {
        const [entries, total] = await this.findAndCount({
            where: {
                title_id: titleId
            },
            order: {
                created_at: 'ASC',
            },
            take: 10,
            skip: Number(query.skip) || 0,
        })

        return { entries, count: total }
    }

    async getEntriesByAuthorOfIt({ username, query }: {
        username: string, query: { skip: number }
    }): Promise<{ entries: EntriesEntity[], count: number }> {
        const [entries, total] = await this.findAndCount({
            where: {
                written_by: username
            },
            order: {
                created_at: 'DESC',
            },
            take: 10,
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

    async getFeaturedEntryByTitleId({ titleId }: { titleId: string }): Promise<EntriesEntity> {
        try {
            const entries = await this.findOneOrFail({
                where: {
                    title_id: titleId
                },
                order: {
                    votes: 'DESC',
                }
            })

            return entries

        } catch (err) {
            throw new BadRequestException('No entry found for given TitleId')
        }
    }

    async createEntry(writtenBy: string, dto: CreateEntryDto): Promise<EntriesEntity> {
        const newTitle: EntriesEntity = new EntriesEntity({
            text: dto.text,
            title_id: dto.titleId,
            written_by: writtenBy,
        })

        try {
            return await this.save(newTitle)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }
    }

    async updateEntry(username: string, entryId: string, text: string): Promise<EntriesEntity> {
        if (!text) throw new BadRequestException('Entry text can not be null.')

        let entry: EntriesEntity
        try {
            entry = await this.findOneOrFail(entryId)
        } catch {
            throw new BadRequestException('Entry could not found by given id')
        }

        if (entry.written_by !== username) throw new BadRequestException('Only author of the entry can update it')
        if (entry.text === text) throw new BadRequestException('Text must be different to update entry')

        try {
            entry.text = text
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

    async deleteEntry(username: string, role: number, entryId: string): Promise<EntriesEntity> {
        let entry: EntriesEntity
        try {
            entry = await this.findOneOrFail(entryId)
        } catch (err) {
            throw new BadRequestException('Entry could not found by given id')
        }

        if (role !== Role.SuperAdmin && entry.written_by !== username) {
            throw new ForbiddenException('You have no permission to do this action')
        }

        await this.delete(entry)
        return entry
    }

    async deleteEntriesBelongsToTitle(title_id: string): Promise<void> {
        const entries: any = await this.find({ title_id })
        await this.delete(entries)
    }
}
