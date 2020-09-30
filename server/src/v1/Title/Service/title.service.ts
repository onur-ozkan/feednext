// Nest dependencies
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Other dependencies
import { Validator, validate } from 'class-validator'
import { createReadStream } from 'fs'

// Local files
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { CreateTitleDto } from '../Dto/create-title.dto'
import { TitlesEntity } from 'src/shared/Entities/titles.entity'
import { UpdateTitleDto } from '../Dto/update-title.dto'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { AwsService } from 'src/shared/Services/aws.service'
import { configService } from 'src/shared/Services/config.service'
import { sitemapManipulationService } from 'src/shared/Services/sitemap.manipulation.service'
import { StatusOk } from 'src/shared/Types'
import { TagsRepository } from 'src/shared/Repositories/tags.repository'

@Injectable()
export class TitleService {
    private validator: Validator

    constructor(
        @InjectRepository(TitlesRepository)
        private readonly titlesRepository: TitlesRepository,
        @InjectRepository(TagsRepository)
        private readonly tagsRepository: TagsRepository,
        @InjectRepository(EntriesRepository)
        private readonly entriesRepository: EntriesRepository,
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
        private readonly awsService: AwsService,
    ) {
        this.validator = new Validator()
    }

    async getTitle(titleQueryData: string, isId: boolean): Promise<ISerializeResponse> {
        let title: TitlesEntity

        if (isId) {
            if (!this.validator.isMongoId(titleQueryData)) throw new BadRequestException('Id must be a type of MongoId')
            title = await this.titlesRepository.getTitleById(titleQueryData)
        } else {
            title = await this.titlesRepository.getTitleBySlug(titleQueryData)
        }

        return serializerService.serializeResponse('title_detail', title)
    }

    async searchTitle({ searchValue }: { searchValue: string }): Promise<ISerializeResponse> {
        if (searchValue.length < 3) throw new BadRequestException('Search value must be greater than 2 characters')
        const result = await this.titlesRepository.searchTitle({ searchValue })
        return serializerService.serializeResponse('searched_title_list', result)
    }

    async getTitleList(
        query: {
            author: string,
            tags: string[],
            sortBy: 'hot' | 'top',
            skip: number,
        }
    ): Promise<ISerializeResponse> {
        const result: {
            titles: TitlesEntity[],
            count: number
        } = await this.titlesRepository.getTitleList(query)
        return serializerService.serializeResponse('title_list', result)
    }

    async createTitle(openedBy: string, payload: any, buffer: Buffer): Promise<ISerializeResponse> {
        payload.name = payload.name.replace(/^\s+|\s+$/g, '')
        if (payload.name.length === 0) throw new BadRequestException('Title name can not be whitespace')
        if (!payload.tags) throw new BadRequestException('tags must be provided')

        const dto = new CreateTitleDto()
        dto.name = payload.name
        dto.tags = payload.tags.split(',')

        const result = await validate(dto, { validationError: { target: false } }).then(async errors => {
            if (errors.length > 0) {
                throw new BadRequestException(errors)
            }

            const newTitle: TitlesEntity = await this.titlesRepository.createTitle(openedBy, dto)
            if (buffer) this.awsService.uploadImage(String(newTitle.id), 'titles', buffer)

            if (configService.isProduction()) sitemapManipulationService.addToIndexedSitemap(newTitle.slug, new Date().toJSON().slice(0, 10))
            return serializerService.serializeResponse('title_detail', newTitle)
        })

        dto.tags.forEach(async element => this.tagsRepository.tagActionOnTitleCreateOrUpdate(element))

        return result
    }

    async getTitleImage(titleId: string): Promise<unknown> {
        await this.titlesRepository.getTitleById(titleId)
        if (configService.isProduction()) {
            return this.awsService.getImageBuffer(titleId, 'titles')
        }
        return createReadStream(`${__dirname}/../../../../public/default-titles.jpg`)
    }

    async updateTitleImage(titleId: string, buffer: Buffer): Promise<void> {
        await this.titlesRepository.getTitleById(titleId)
        this.awsService.uploadImage(titleId, 'titles', buffer)
    }

    async deleteTitleImage(titleId: string): Promise<void> {
        await this.titlesRepository.getTitleById(titleId)
        this.awsService.deleteImage(titleId, 'titles')
    }

    async rateTitle(ratedBy: string, titleId: string, rateValue: number): Promise<StatusOk> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('Id must be a type of MongoId')

        try {
            this.usersRepository.findOneOrFail({ username: ratedBy })
        } catch (error) {
            throw new NotFoundException('User could not found by given username')
        }

        await this.titlesRepository.rateTitle(ratedBy, titleId, rateValue)
        return { status: 'ok', message: 'Title has been rated' }
    }

    async getRateOfUser(username: string, titleId: string): Promise<ISerializeResponse> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('Id must be a type of MongoId')

        try {
            this.usersRepository.findOneOrFail({ username })
        } catch (error) {
            throw new NotFoundException('User could not found by given username')
        }

        const rate = await this.titlesRepository.getRateOfUser(username, titleId)
        return serializerService.serializeResponse('title_rate_of_user', { title_id: titleId, rate })
    }

    async getAvarageRate(titleId: string): Promise<ISerializeResponse> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('Id must be a type of MongoId')
        const averageRate = await this.titlesRepository.getAvarageRate(titleId)
        return serializerService.serializeResponse('average_title_rate', { title_id: titleId, rate: averageRate })
    }

    async updateTitle(updatedBy: string, titleId: string, dto: UpdateTitleDto): Promise<ISerializeResponse> {
        if (dto.name) dto.name = dto.name.replace(/^\s+|\s+$/g, '')
        if (dto.name?.length === 0) throw new BadRequestException('Title name can not be whitespace')

        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('Id must be a type of MongoId')

        let title: TitlesEntity
        try {
            title = await this.titlesRepository.findOneOrFail(titleId)
        } catch {
            throw new NotFoundException('Title could not found by given id')
        }

        if (dto.tags) {
            dto.tags.forEach(async element => this.tagsRepository.tagActionOnTitleCreateOrUpdate(element))
            title.tags.forEach(async element => this.tagsRepository.updateTagWhenRemovedFromTitle(element))
        }

        const updatedTitle: TitlesEntity = await this.titlesRepository.updateTitle(updatedBy, title, dto)
        if (configService.isProduction()) sitemapManipulationService.addToIndexedSitemap(updatedTitle.slug, new Date().toJSON().slice(0, 10))

        return serializerService.serializeResponse('title_detail', updatedTitle)
    }

    async deleteTitle(titleId: string): Promise<StatusOk> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('Id must be a type of MongoId')

        await this.titlesRepository.deleteTitle(titleId)
        await this.entriesRepository.deleteEntriesBelongsToTitle(titleId)
        this.awsService.deleteImage(titleId, 'titles')
        return { status: 'ok', message: 'Title has been deleted' }
    }
}
