// Nest dependencies
import { Injectable, HttpException, BadRequestException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Other dependencies
import { Validator } from 'class-validator'
import { ObjectID } from 'mongodb'

// Local files
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { CreateTitleDto } from '../Dto/create-title.dto'
import { TitlesEntity } from 'src/shared/Entities/titles.entity'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { UpdateTitleDto } from '../Dto/update-title.dto'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { UsersRepository } from 'src/shared/Repositories/users.repository'


@Injectable()
export class TitleService {
    private validator: ObjectID

    constructor(
        @InjectRepository(TitlesRepository)
        private readonly titlesRepository: TitlesRepository,
        @InjectRepository(CategoriesRepository)
        private readonly categoriesRepository: CategoriesRepository,
        @InjectRepository(EntriesRepository)
        private readonly entriesRepository: EntriesRepository,
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
    ) {
        this.validator = new Validator()
    }

    async getTitle(titleSlug: string): Promise<ISerializeResponse> {
        const title: TitlesEntity = await this.titlesRepository.getTitle(titleSlug)
        const id: string = String(title.id)
        delete title.id
        return serializerService.serializeResponse('title_detail', title, id)
    }

    async searchTitle({ searchValue } : { searchValue: string }): Promise<ISerializeResponse> {
        const result = await this.titlesRepository.searchTitle({ searchValue })
        return serializerService.serializeResponse('searched_title_list', result)
    }

    async getTitleList(query: { limit: number, skip: number, orderBy: any }): Promise<ISerializeResponse> {
        const result: {
            titles: TitlesEntity[],
            count: number
        } = await this.titlesRepository.getTitleList(query)
        return serializerService.serializeResponse('title_list', result)
    }

    async getTitleListByAuthorOfIt({ username, query }: {
        username: string
        query: { limit: number, skip: number, orderBy: any }
    }): Promise<ISerializeResponse> {
        const result: {
            titles: TitlesEntity[],
            count: number
        } = await this.titlesRepository.getTitleListByAuthorOfIt({ username, query })
        return serializerService.serializeResponse('title_list_of_author', result)
    }

    async createTitle(openedBy: string, dto: CreateTitleDto): Promise<HttpException | ISerializeResponse> {
        try {
          await this.categoriesRepository.findOneOrFail(dto.categoryId)
        } catch (err) {
          throw new BadRequestException(`Category with id:${dto.categoryId} does not match in database.`)
        }

        const newTitle: TitlesEntity = await this.titlesRepository.createTitle(openedBy, dto)
        return serializerService.serializeResponse('title_detail', newTitle)
    }

    async rateTitle(ratedBy: string, titleId: string, rateValue: number): Promise<HttpException> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('TitleId must be a MongoId.')

        try {
            this.usersRepository.findOneOrFail({ username: ratedBy })
        } catch (error) {
            throw new BadRequestException('User not found by given username')
        }

        await this.titlesRepository.rateTitle(ratedBy, titleId, rateValue)
        throw new HttpException('Title has been rated', HttpStatus.OK)
    }

    async getRateOfUser(username: string, titleId: string): Promise<any> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('TitleId must be a MongoId.')

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
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('TitleId must be a MongoId.')
        if (dto.categoryId && !this.validator.isMongoId(dto.categoryId)) {
            throw new BadRequestException('CategoryId must be a MongoId.')
        }

        const title: TitlesEntity = await this.titlesRepository.updateTitle(updatedBy, titleId, dto)
        const id: string = String(title.id)
        delete title.id
        return serializerService.serializeResponse('title_detail', title, id)
    }

    async deleteTitle(titleId: string): Promise<HttpException> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException('TitleId must be a MongoId.')

        const title = await this.titlesRepository.deleteTitle(titleId)
        await this.entriesRepository.deleteEntriesBelongsToTitle(title.slug)
        throw new HttpException('Title has been deleted.', HttpStatus.OK)
    }
}
