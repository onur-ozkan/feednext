// Nest dependencies
import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Other dependencies
import { ObjectID } from 'mongodb'
import { Validator } from 'class-validator'

// Local files
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { CategoriesEntity } from 'src/shared/Entities/categories.entity'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'
import { CreateCategoryDto } from '../Dto/create-category.dto'
import { UpdateCategoryDto } from '../Dto/update-category.dto'

@Injectable()
export class CategoryService {

    private validator: ObjectID

    constructor(
        @InjectRepository(CategoriesRepository)
        private readonly categoriesRepository: CategoriesRepository,
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

    async getCategoryList(query: { limit: number, skip: number, orderBy: any }): Promise<ISerializeResponse> {
        const result: {categories: CategoriesEntity[], count: number} = await this.categoriesRepository.getCategoryList(query)
        return serializerService.serializeResponse('category_list', result)
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

        const category: CategoriesEntity = await this.categoriesRepository.deleteCategory(categoryId)
        const id: string = String(category.id)
        delete category.id
        return serializerService.serializeResponse('category_detail', category, id)
    }
}
