// Nest dependencies
import { Injectable, HttpException, BadRequestException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Other dependencies
import { Validator, validate } from 'class-validator'
import { createReadStream } from 'fs'

// Local files
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { CreateTitleDto } from '../Dto/create-title.dto'
import { TitlesEntity } from 'src/shared/Entities/titles.entity'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { UpdateTitleDto } from '../Dto/update-title.dto'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { CategoriesEntity } from 'src/shared/Entities/categories.entity'
import { AwsService } from 'src/shared/Services/aws.service'
import { configService } from 'src/shared/Services/config.service'
import { sitemapManipulationService } from 'src/shared/Services/sitemap.manipulation.service'

@Injectable()
export class TitleService {
    private validator

    constructor(
        @InjectRepository(TitlesRepository)
        private readonly titlesRepository: TitlesRepository,
        @InjectRepository(CategoriesRepository)
        private readonly categoriesRepository: CategoriesRepository,
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
            if (!this.validator.isMongoId(titleQueryData)) throw new BadRequestException('TitleId must be a MongoId.')
            title = await this.titlesRepository.getTitleById(titleQueryData)
        } else {
            title = await this.titlesRepository.getTitleBySlug(titleQueryData)
        }

        return serializerService.serializeResponse('title_detail', title)
    }

    async searchTitle({ searchValue }: { searchValue: string }): Promise<ISerializeResponse> {
        if (searchValue.length < 3) throw new BadRequestException('Search value must be at least 3 characters')
        const result = await this.titlesRepository.searchTitle({ searchValue: searchValue.split(' ').join('|') })
        return serializerService.serializeResponse('searched_title_list', result)
    }

    async getTitleList(
        query: {
            author: string,
            categoryIds: string[],
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

    async createTitle(openedBy: string, payload: CreateTitleDto, buffer: Buffer): Promise<HttpException | ISerializeResponse> {
        payload.name = payload.name.replace(/^\s+|\s+$/g, '')
        if (payload.name.length === 0) throw new BadRequestException('Title name can not be whitespace')

        const dto = new CreateTitleDto()
        dto.name = payload.name
        dto.categoryId = payload.categoryId

        return await validate(dto, { validationError: { target: false } }).then(async errors => {
            if (errors.length > 0) {
                throw new BadRequestException(errors)
            }

            let category: CategoriesEntity
            try {
                category = await this.categoriesRepository.findOneOrFail(dto.categoryId)
            } catch (err) {
                throw new BadRequestException('Category could not found by given id')
            }

            if (!category.is_leaf) throw new BadRequestException('Category that is not leaf can not have titles')

            const newTitle: TitlesEntity = await this.titlesRepository.createTitle(openedBy, dto, category.ancestors)
            if (buffer) this.awsService.uploadImage(String(newTitle.id), 'titles', buffer)

            if (configService.isProduction()) sitemapManipulationService.addToIndexedSitemap(newTitle.slug, new Date().toJSON().slice(0,10))
            return serializerService.serializeResponse('title_detail', newTitle)
        })
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

    async rateTitle(ratedBy: string, titleId: string, rateValue: number): Promise<HttpException> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('TitleId must be a MongoId')

        try {
            this.usersRepository.findOneOrFail({ username: ratedBy })
        } catch (error) {
            throw new BadRequestException('User not found by given username')
        }

        await this.titlesRepository.rateTitle(ratedBy, titleId, rateValue)
        throw new HttpException('Title has been rated', HttpStatus.OK)
    }

    async getRateOfUser(username: string, titleId: string): Promise<any> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('TitleId must be a MongoId')

        try {
            this.usersRepository.findOneOrFail({ username })
        } catch (error) {
            throw new BadRequestException('User not found by given username')
        }

        const rate = await this.titlesRepository.getRateOfUser(username, titleId)
        return serializerService.serializeResponse('title_rate_of_user', { title_id: titleId, rate })
    }

    async getAvarageRate(titleId: string): Promise<ISerializeResponse> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('TitleId must be a MongoId.')
        const averageRate = await this.titlesRepository.getAvarageRate(titleId)
        return serializerService.serializeResponse('average_title_rate', { title_id: titleId, rate: averageRate })
    }

    async updateTitle(updatedBy: string, titleId: string, dto: UpdateTitleDto): Promise<ISerializeResponse> {
        dto.name = dto.name.replace(/^\s+|\s+$/g, '')
        if (dto.name.length === 0) throw new BadRequestException('Title name can not be whitespace')

        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('TitleId must be a MongoId.')

        let title: TitlesEntity
        try {
            title = await this.titlesRepository.findOneOrFail(titleId)
        } catch {
            throw new BadRequestException('Title could not found by given id')
        }

        if (dto.categoryId && !this.validator.isMongoId(dto.categoryId)) {
            throw new BadRequestException('CategoryId must be a MongoId.')
        }

        let category
        if (dto.categoryId) {
            try {
                category = await this.categoriesRepository.findOneOrFail(dto.categoryId)
            } catch (err) {
                throw new BadRequestException('Category could not found by given id')
            }
        }

        const updatedTitle: TitlesEntity = await this.titlesRepository.updateTitle(updatedBy, title, dto, category?.ancestors)
        if (configService.isProduction()) sitemapManipulationService.addToIndexedSitemap(updatedTitle.slug, new Date().toJSON().slice(0,10))

        return serializerService.serializeResponse('title_detail', updatedTitle)
    }

    async deleteTitle(titleId: string): Promise<HttpException> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('TitleId must be a MongoId.')

        await this.titlesRepository.deleteTitle(titleId)
        await this.entriesRepository.deleteEntriesBelongsToTitle(titleId)
        this.awsService.deleteImage(titleId, 'titles')
        throw new HttpException('Title has been deleted.', HttpStatus.OK)
    }
}
