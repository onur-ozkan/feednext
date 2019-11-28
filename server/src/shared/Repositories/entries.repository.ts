import { NotFoundException, BadRequestException, UnprocessableEntityException } from '@nestjs/common'
import { EntriesEntity } from '../Entities/entries.entity'
import { CreateEntryDto } from 'src/v1/Entry/Dto/create-entry.dto'
import { Repository, EntityRepository } from 'typeorm'
import { Validator } from 'class-validator'
import { ObjectID } from 'mongodb'

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
  }
