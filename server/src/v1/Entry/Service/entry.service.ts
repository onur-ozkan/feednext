// Nest dependencies
import { Injectable, BadRequestException, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Local files
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { EntriesEntity } from 'src/shared/Entities/entries.entity'
import { CreateEntryDto } from '../Dto/create-entry.dto'
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'

@Injectable()
export class EntryService {
    constructor(
        @InjectRepository(EntriesRepository)
        private readonly entriesRepository: EntriesRepository,
        @InjectRepository(TitlesRepository)
        private readonly titlesRepository: TitlesRepository,
    ) {}

    async getEntry(entryId: string): Promise<ISerializeResponse> {
        const entry: EntriesEntity = await this.entriesRepository.getEntry(entryId)
        const id: string = String(entry.id)
        delete entry.id
        return serializerService.serializeResponse(`entry_detail`, entry, id)
    }

    async getEntryList(query: { limit: number, skip: number, orderBy: any }): Promise<ISerializeResponse> {
        const result: {entries: EntriesEntity[], count: number} = await this.entriesRepository.getEntryList(query)
        return serializerService.serializeResponse(`entry_list`, result)
    }

    async updateEntry(updatedBy: string, entryId: string, text: string): Promise<ISerializeResponse> {
        const entry: EntriesEntity = await this.entriesRepository.updateEntry(updatedBy, entryId, text)
        const id: string = String(entry.id)
        delete entry.id
        return serializerService.serializeResponse(`entry_detail`, entry, id)
    }

    async createEntry(writtenBy: string, dto: CreateEntryDto): Promise<HttpException | ISerializeResponse> {
        try {
          await this.titlesRepository.findOneOrFail(dto.titletId)
        } catch (err) {
          throw new BadRequestException(`Title with id:${dto.titletId} does not match in database.`)
        }

        const newEntry: EntriesEntity = await this.entriesRepository.createEntry(writtenBy, dto)
        return serializerService.serializeResponse(`entry_detail`, newEntry)
    }

    async deleteEntry(entryId: string): Promise<ISerializeResponse> {
        const entry: EntriesEntity = await this.entriesRepository.deleteEntry(entryId)
        const id: string = String(entry.id)
        delete entry.id
        return serializerService.serializeResponse(`entry_detail`, entry, id)
    }
}
