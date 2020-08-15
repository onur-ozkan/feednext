// Nest dependencies
import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Other dependencies
import { ObjectId } from 'mongodb'
import { Validator } from 'class-validator'

// Local files
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { CategoriesEntity } from 'src/shared/Entities/categories.entity'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'
import { CreateCategoryDto } from '../Dto/create-category.dto'
import { UpdateCategoryDto } from '../Dto/update-category.dto'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { StatusOk } from 'src/shared/Types'

@Injectable()
export class CategoryService {
    private validator: Validator

    constructor(
        @InjectRepository(CategoriesRepository)
        private readonly categoriesRepository: CategoriesRepository,
        @InjectRepository(EntriesRepository)
        private readonly entriesRepository: EntriesRepository,
        @InjectRepository(TitlesRepository)
        private readonly titlesRepository: TitlesRepository,
    ) {
        this.validator = new Validator()
    }

    async getCategory(categoryId: string): Promise<ISerializeResponse> {
        if (!this.validator.isMongoId(categoryId)) throw new BadRequestException('Id must be a type of MongoId')

        const category: CategoriesEntity = await this.categoriesRepository.getCategory(categoryId)
        return serializerService.serializeResponse('category_detail', category)
    }

    async getMainCategories(): Promise<ISerializeResponse> {
        const result: {categories: CategoriesEntity[], count: number} = await this.categoriesRepository.getMainCategories()
        return serializerService.serializeResponse('category_list', result)
    }

    async getChildCategories(categoryId: string): Promise<ISerializeResponse> {
        const result: {categories: CategoriesEntity[], count: number} = await this.categoriesRepository.getChildCategories(categoryId)
        return serializerService.serializeResponse('category_list', result)
    }

    async getTrendingCategories(): Promise<ISerializeResponse> {
        const latestEntries = await this.entriesRepository.getLatestEntries()

        // Parse most belonged titles
        const topTitlesOfLatestEntries = [...latestEntries.entries.reduce((previous, current) => {
            if(!previous.has(current.title_id)) previous.set(current.title_id, {id: current.title_id, entryCount: 1})
            else previous.get(current.title_id).entryCount++
            return previous
        // tslint:disable-next-line:new-parens
        }, new Map).values()]

        // Sort the title list by desc of entry counts and then take first 5 of them (Because trending category count will be 5)
        const topFiveTitlesIds = topTitlesOfLatestEntries.sort((x, y) => y.entryCount - x.entryCount).slice(0, 5)

        // Make flat slug list and query them to get titles belongs to that slugs
        const idList = topFiveTitlesIds.map(item => ObjectId(item.id))
        const topFiveTitles = await this.titlesRepository.getTitleListByIds(idList)

        // Make flat category_id list to get trending categories
        const categoryIdList = topFiveTitles.titles.map(item => ObjectId(item.category_id))
        const trendingCategories = await this.categoriesRepository.getCategoryListByIds(categoryIdList)

        return serializerService.serializeResponse('trending_categories', trendingCategories)
    }

    async createCategory(dto: CreateCategoryDto): Promise<ISerializeResponse> {
        const newCategory: CategoriesEntity = await this.categoriesRepository.createCategory(dto)
        return serializerService.serializeResponse('category_detail', newCategory)
    }

    async updateCategory(categoryId: string, dto: UpdateCategoryDto): Promise<ISerializeResponse> {
        if (!this.validator.isMongoId(categoryId)) throw new BadRequestException('Id must be a type of MongoId')

        const category: CategoriesEntity = await this.categoriesRepository.updateCategory(categoryId, dto)
        return serializerService.serializeResponse('category_detail', category)
    }

    async deleteCategory(categoryId: string): Promise<StatusOk> {
        if (!this.validator.isMongoId(categoryId)) throw new BadRequestException('Id must be a type of MongoId')

        await this.categoriesRepository.deleteCategory(categoryId)
        return { status: 'ok', message: 'Category has been deleted' }
    }
}
