// Nest dependencies
import { NotFoundException, BadRequestException, UnprocessableEntityException } from '@nestjs/common'

// Other dependencies
import { Repository, EntityRepository } from 'typeorm'
import { Validator } from 'class-validator'
import { ObjectID } from 'mongodb'

// Local files
import { EntriesEntity } from '../Entities/entries.entity'
import { CreateEntryDto } from 'src/v1/Entry/Dto/create-entry.dto'

@EntityRepository(EntriesEntity)
export class EntriesRepository extends Repository<EntriesEntity> {
    private validator: ObjectID

    constructor() {
        super()
        this.validator = new Validator()
    }

    async getEntry(entryId: string): Promise<EntriesEntity> {
        if (!this.validator.isMongoId(entryId)) throw new BadRequestException(`EntryId must be a MongoId.`)
        try {
            const entry: EntriesEntity = await this.findOneOrFail(entryId)
            return entry
        } catch (err) {
            throw new NotFoundException(`Entry with that id could not found in the database.`)
        }
    }

    async getEntryList(query: { limit: number, skip: number, orderBy: any }): Promise<{entries: EntriesEntity[], count: number}> {
        const orderBy = query.orderBy || 'ASC'

        try {
            const [entries, total] = await this.findAndCount({
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
        const newProduct: EntriesEntity = new EntriesEntity({
            text: dto.text,
            product_id: dto.productId,
            written_by: writtenBy,
        })

        try {
            return await this.save(newProduct)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }
    }

    async updateEntry(updatedBy: string, entryId: string, text: string): Promise<EntriesEntity> {
        if (!text) throw new BadRequestException(`Entry text can not be null.`)
        if (!this.validator.isMongoId(entryId)) throw new BadRequestException(`EntryId must be a MongoId.`)

        let entry: EntriesEntity
        try {
            entry = await this.findOneOrFail(entryId)
        } catch {
            throw new NotFoundException(`Entry with that id could not found in the database.`)
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

    async deleteEntry(entryId: string): Promise<EntriesEntity> {
        if (!this.validator.isMongoId(entryId)) throw new BadRequestException(`EntryId must be a MongoId.`)
        try {
            const entry: EntriesEntity = await this.findOneOrFail(entryId)
            await this.delete(entry)
            return entry
        } catch (err) {
            throw new NotFoundException(`Entry with that id could not found in the database.`)
        }
    }
}
