import { Repository, EntityRepository } from 'typeorm'
import { EntriesEntity } from '../Entities/entries.entity'
import { Validator } from 'class-validator'
import { ObjectID } from 'mongodb'
import { NotFoundException, BadRequestException } from '@nestjs/common'

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
  }
