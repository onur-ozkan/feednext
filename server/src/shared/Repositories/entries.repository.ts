// Nest dependencies
import { NotFoundException, BadRequestException, UnprocessableEntityException } from '@nestjs/common'

// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

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
            throw new NotFoundException('Entry with that id could not found in the database.')
        }
    }

    async getEntriesByTitleId({ titleId, query }: {
        titleId: string, query: { limit: number, skip: number, orderBy: any }
    }): Promise<{ entries: EntriesEntity[], count: number }> {
        const orderBy = query.orderBy || 'ASC'

        try {
            const [entries, total] = await this.findAndCount({
                where: {
                    title_id: titleId
                },
                order: {
                    created_at: orderBy.toUpperCase(),
                },
                take: Number(query.limit) || 10,
                skip: Number(query.skip) || 0,
            })
            return {
                entries,
                count: total,
            }
        } catch (err) {
            throw new BadRequestException(err)
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

    async updateEntry(updatedBy: string, entryId: string, text: string): Promise<EntriesEntity> {
        if (!text) throw new BadRequestException('Entry text can not be null.')

        let entry: EntriesEntity
        try {
            entry = await this.findOneOrFail(entryId)
        } catch {
            throw new NotFoundException('Entry with that id could not found in the database.')
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
            throw new NotFoundException('Entry with that id could not found in the database.')
        }
    }

    async deleteEntriesBelongsToTitle(titleId: string): Promise<void> {
        const entries: any = await this.find({ title_id: titleId })
        await this.delete(entries)
    }
}
