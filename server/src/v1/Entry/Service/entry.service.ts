import { Injectable, HttpException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { EntriesEntity } from 'src/shared/Entities/entries.entity'
import { OkException } from 'src/shared/Filters/ok-exception.filter'
import { CreateEntryDto } from '../Dto/create-entry.dto'
import { ProductsRepository } from 'src/shared/Repositories/products.repository'

@Injectable()
export class EntryService {
    constructor(
        @InjectRepository(EntriesRepository)
        private readonly entriesRepository: EntriesRepository,
        @InjectRepository(ProductsRepository)
        private readonly productsRepository: ProductsRepository,
    ) {}

    async getEntry(entryId: string): Promise<HttpException> {
        const entry: EntriesEntity = await this.entriesRepository.getEntry(entryId)
        const id: string = String(entry.id)
        delete entry.id
        throw new OkException(`entry_detail`, entry, `Entry ${entry.text} is successfully loaded.`, id)
    }

    async getEntryList(query: { limit: number, skip: number, orderBy: any }): Promise<HttpException> {
        const result: {entries: EntriesEntity[], count: number} = await this.entriesRepository.getEntryList(query)
        throw new OkException(`entry_list`, result, `List of entries are successfully loaded.`)
    }

    async updateEntry(entryId: string, text: string): Promise<HttpException> {
        const entry: EntriesEntity = await this.entriesRepository.updateEntry(entryId, text)
        const id: string = String(entry.id)
        delete entry.id
        throw new OkException(`entry_detail`, entry, `Entry with the id:${entry.id} is successfully updated.`, id)
    }

    async createEntry(writtenBy: string, dto: CreateEntryDto): Promise<HttpException> {
        try {
          await this.productsRepository.findOneOrFail(dto.productId)
        } catch (err) {
          throw new BadRequestException(`Product with id:${dto.productId} does not match in database.`)
        }

        const newEntry: EntriesEntity = await this.entriesRepository.createEntry(writtenBy, dto)
        throw new OkException(`entry_detail`, newEntry)
    }

    async deleteEntry(entryId: string): Promise<HttpException> {
        const entry: EntriesEntity = await this.entriesRepository.deleteEntry(entryId)
        const id: string = String(entry.id)
        delete entry.id
        throw new OkException(`entry_detail`, entry, `Entry ${entry.text} is successfully deleted.`, id)
    }
}
