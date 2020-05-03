// Nest dependencies
import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common'
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

@Injectable()
export class CategoryService {

    private validator: ObjectId

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
        if (!this.validator.isMongoId(categoryId)) throw new BadRequestException('CategoryId must be a MongoId.')

        const category: CategoriesEntity = await this.categoriesRepository.getCategory(categoryId)
        const id: string = String(category.id)
        delete category.id
        return serializerService.serializeResponse('category_detail', category, id)
    }

    async getCategoryList(query: { skip: number }): Promise<ISerializeResponse> {
        const result: {categories: CategoriesEntity[], count: number} = await this.categoriesRepository.getCategoryList(query)
        return serializerService.serializeResponse('category_list', result)
    }

    async getTrendingCategories(): Promise<ISerializeResponse> {
        const latestEntries = await this.entriesRepository.getLatestEntries()

        // Parse most belonged titles
        const topTitlesOfLatestEntries = [...latestEntries.entries.reduce((r, e) => {
            const k = e.title_id
            if(!r.has(k)) r.set(k, {id: e.title_id, entryCount: 1})
            else r.get(k).entryCount++
            return r
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
        if (!this.validator.isMongoId(categoryId)) throw new BadRequestException('CategoryId must be a MongoId.')

        const category: CategoriesEntity = await this.categoriesRepository.updateCategory(categoryId, dto)
        const id: string = String(category.id)
        delete category.id
        return serializerService.serializeResponse('category_detail', category, id)
    }

    async deleteCategory(categoryId: string): Promise<ISerializeResponse> {
        if (!this.validator.isMongoId(categoryId)) throw new BadRequestException('CategoryId must be a MongoId.')

        await this.categoriesRepository.deleteCategory(categoryId)
        throw new HttpException('Category has been deleted.', HttpStatus.OK)
    }
}
