// Nest dependencies
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Local files
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { CategoriesEntity } from 'src/shared/Entities/categories.entity'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'
import { CreateCategoryDto } from '../Dto/create-category.dto'
import { UpdateCategoryDto } from '../Dto/update-category.dto'

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoriesRepository)
        private readonly categoriesRepository: CategoriesRepository,
    ) {}

    async getCategory(categoryId: string): Promise<ISerializeResponse> {
        const category: CategoriesEntity = await this.categoriesRepository.getCategory(categoryId)
        const id: string = String(category.id)
        delete category.id
        return serializerService.serializeResponse(`category_detail`, category, id)
    }

    async getCategoryList(query: { limit: number, skip: number, orderBy: any }): Promise<ISerializeResponse> {
        const result: {categories: CategoriesEntity[], count: number} = await this.categoriesRepository.getCategoryList(query)
        return serializerService.serializeResponse(`category_list`, result)
    }

    async createCategory(dto: CreateCategoryDto): Promise<ISerializeResponse> {
        const newCategory: CategoriesEntity = await this.categoriesRepository.createCategory(dto)
        return serializerService.serializeResponse(`category_detail`, newCategory)
    }

    async updateCategory(categoryId: string, dto: UpdateCategoryDto): Promise<ISerializeResponse> {
        const category: CategoriesEntity = await this.categoriesRepository.updateCategory(categoryId, dto)
        const id: string = String(category.id)
        delete category.id
        return serializerService.serializeResponse(`category_detail`, category, id)
    }

    async deleteCategory(categoryId: string): Promise<ISerializeResponse> {
        const category: CategoriesEntity = await this.categoriesRepository.deleteCategory(categoryId)
        const id: string = String(category.id)
        delete category.id
        return serializerService.serializeResponse(`category_detail`, category, id)
    }
}
