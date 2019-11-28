import { Injectable, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { EntriesEntity } from 'src/shared/Entities/entries.entity'
import { OkException } from 'src/shared/Filters/ok-exception.filter'

@Injectable()
export class EntryService {
    constructor(
        @InjectRepository(EntriesRepository)
        private readonly entriesRepository: EntriesRepository,
    ) {}

    async getEntry(entryId: string): Promise<HttpException> {
        const entry: EntriesEntity = await this.entriesRepository.getEntry(entryId)
        const id: string = String(entry.id)
        delete entry.id
        throw new OkException(`entry_detail`, entry, `Entry ${entry.text} is successfully loaded.`, id)
    }
}
