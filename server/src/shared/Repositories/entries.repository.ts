// Nest dependencies
import { BadRequestException, UnprocessableEntityException, ForbiddenException, ConflictException } from '@nestjs/common'

// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

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

    async getVotedEntriesByUsername({ username, query }: {
        username: string,
        query: {
            skip: number,
            voteType: 'up' | 'down'
        }
    }): Promise<{ entries: EntriesEntity[], count: number }> {
        const [entries, total] = await this.findAndCount({
            where: {
                ...query.voteType !== 'down' && {
                    'votes.up_voted': { $in: [username] }
                },
                ...query.voteType === 'down' && {
                    'votes.down_voted': { $in: [username] }
                },
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
        titleId: string,
        query: {
            skip: number,
            sortBy: 'newest' | 'top'
        }
    }): Promise<{ entries: EntriesEntity[], count: number }> {
        const [entries, total] = await this.findAndCount({
            where: {
                title_id: titleId
            },
            order: {
                ...query.sortBy === 'newest' && {
                    created_at: 'DESC',
                },
                ...query.sortBy === 'top' && {
                    votes: 'DESC',
                }
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

    async voteEntry({ entryId, isUpVoted, username }: { entryId: string, isUpVoted: boolean, username: string }): Promise<void> {
        const entry: EntriesEntity = await this.findOneOrFail(entryId)

        if (isUpVoted) {
            if (entry.votes.up_voted.includes(username)) throw new ConflictException('The entry is already up voted')
            if (entry.votes.down_voted.includes(username)) {
                entry.votes.value++
                entry.votes.down_voted = entry.votes.down_voted.filter(item => item !== username)
            }
            entry.votes.value++
            entry.votes.up_voted.push(username)
        } else {
            if (entry.votes.down_voted.includes(username)) throw new ConflictException('The entry is already down voted')
            if (entry.votes.up_voted.includes(username)) {
                entry.votes.value--
                entry.votes.up_voted = entry.votes.up_voted.filter(item => item !== username)
            }
            entry.votes.value--
            entry.votes.down_voted.push(username)
        }

        this.save(entry)
    }

    async undoVoteOfEntry({ entryId, isUpVoted, username }: { entryId: string, isUpVoted: boolean, username: string }): Promise<void> {
        const entry: EntriesEntity = await this.findOneOrFail(entryId)
        if (isUpVoted) {
            if (!entry.votes.up_voted.includes(username)) throw new BadRequestException('Entry has not up voted yet')
            entry.votes.value--
            entry.votes.up_voted = entry.votes.up_voted.filter(item => item !== username)
        } else {
            if (!entry.votes.down_voted.includes(username)) throw new BadRequestException('Entry has not down voted yet')
            entry.votes.value++
            entry.votes.down_voted = entry.votes.down_voted.filter(item => item !== username)
        }

        this.save(entry)
    }

    async deleteEntry(username: string, role: number, entryId: string): Promise<EntriesEntity> {
        let entry: EntriesEntity
        try {
            entry = await this.findOneOrFail(entryId)
        } catch (err) {
            throw new BadRequestException('Entry could not found by given id')
        }

        if (role < Role.Admin && entry.written_by !== username) {
            throw new ForbiddenException('You have no permission to do this action')
        }

        await this.delete(entry)
        return entry
    }

    async deleteEntriesBelongsToTitle(title_id: string): Promise<void> {
        const entries: any = await this.find({ title_id })
        await this.remove(entries)
    }

    async deleteEntriesBelongsToUsername(username: string): Promise<EntriesEntity[]> {
        const entries: EntriesEntity[] = await this.find({ written_by: username })
        await this.remove(entries)

        return entries
    }
}
