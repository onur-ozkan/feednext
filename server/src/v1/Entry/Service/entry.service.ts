// Nest dependencies
import { Injectable, BadRequestException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Other dependencies
import { Validator } from 'class-validator'
import { ObjectID } from 'mongodb'

// Local files
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { EntriesEntity } from 'src/shared/Entities/entries.entity'
import { CreateEntryDto } from '../Dto/create-entry.dto'
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'
import { UsersRepository } from 'src/shared/Repositories/users.repository'

@Injectable()
export class EntryService {

    private validator: ObjectID

    constructor(
        @InjectRepository(EntriesRepository)
        private readonly entriesRepository: EntriesRepository,
        @InjectRepository(TitlesRepository)
        private readonly titlesRepository: TitlesRepository,
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
    ) {
        this.validator = new Validator()
    }

    async getEntry(entryId: string): Promise<ISerializeResponse> {
        if (!this.validator.isMongoId(entryId)) throw new BadRequestException('EntryId must be a MongoId.')

        const entry: EntriesEntity = await this.entriesRepository.getEntry(entryId)
        const id: string = String(entry.id)
        delete entry.id
        return serializerService.serializeResponse('entry_detail', entry, id)
    }

    async getEntriesByTitleId({titleId, query}: {titleId: string, query: { limit: number, skip: number, orderBy: any }}): Promise<ISerializeResponse> {
        const result: { entries: EntriesEntity[], count: number } = await this.entriesRepository.getEntriesByTitleId({titleId, query})
        return serializerService.serializeResponse('entry_list', result)
    }

    async updateEntry(updatedBy: string, entryId: string, text: string): Promise<ISerializeResponse> {
        if (!this.validator.isMongoId(entryId)) throw new BadRequestException('EntryId must be a MongoId.')

        const entry: EntriesEntity = await this.entriesRepository.updateEntry(updatedBy, entryId, text)
        const id: string = String(entry.id)
        delete entry.id
        return serializerService.serializeResponse('entry_detail', entry, id)
    }

    async createEntry(writtenBy: string, dto: CreateEntryDto): Promise<HttpException | ISerializeResponse> {
        if (!this.validator.isMongoId(dto.titleId)) throw new BadRequestException('TitleId must be a MongoId.')

        try {
            await this.titlesRepository.updateEntryCount(dto.titleId, true)
        } catch (err) {
            throw new BadRequestException(`Title with id:${dto.titleId} does not match in the database.`)
        }

        const newEntry: EntriesEntity = await this.entriesRepository.createEntry(writtenBy, dto)
        return serializerService.serializeResponse('entry_detail', newEntry)
    }

    async undoVoteOfEntry({ entryId, username, isUpVoted }: {entryId: string, username: string, isUpVoted: boolean}): Promise<HttpException> {
        if (!this.validator.isMongoId(entryId)) throw new BadRequestException('EntryId must be a MongoId.')

        try {
            await this.entriesRepository.findOneOrFail(entryId)
        } catch (e) {
            throw new NotFoundException('Entry with that id could not found in the database.')
        }

        await this.usersRepository.undoVotedEntry({entryId, username, isUpVoted})
        await this.entriesRepository.voteEntry({entryId, isUpVoted: !isUpVoted})
        throw new HttpException('Entry has been un voted.', HttpStatus.OK)
    }

    async voteEntry({ entryId, username, isUpVoted }: {entryId: string, username: string, isUpVoted: boolean}): Promise<HttpException> {
        if (!this.validator.isMongoId(entryId)) throw new BadRequestException('EntryId must be a MongoId.')

        try {
            await this.entriesRepository.findOneOrFail(entryId)
        } catch (e) {
            throw new NotFoundException('Entry with that id could not found in the database.')
        }

        await this.usersRepository.addVotedEntry({entryId, username, isUpVoted})
        await this.entriesRepository.voteEntry({entryId, isUpVoted})
        throw new HttpException('Entry has been voted.', HttpStatus.OK)
    }

    async deleteEntry(entryId: string): Promise<HttpException> {
        if (!this.validator.isMongoId(entryId)) throw new BadRequestException('EntryId must be a MongoId.')

        const entry: EntriesEntity = await this.entriesRepository.deleteEntry(entryId)
        await this.titlesRepository.updateEntryCount(entry.title_id, false)
        throw new HttpException('Entry has been deleted.', HttpStatus.OK)
    }
}
