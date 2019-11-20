import { Injectable, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { CategoriesEntity } from 'src/shared/Entities/categories.entity'
import { OkException } from 'src/shared/Filters/ok-exception.filter'
import { CreateCategoryDto } from '../Dto/create-category.dto'

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoriesRepository)
        private readonly categoriesRepository: CategoriesRepository,
    ) {}

    async getCategory(categoryId: string): Promise<HttpException> {
        const category: CategoriesEntity = await this.categoriesRepository.getCategory(categoryId)
        const id: string = String(category.id)
        delete category.id
        throw new OkException(`category_detail`, category, `Category ${category.name} is successfully loaded.`, id)
    }

    async getCategoryList(query: any): Promise<HttpException> {
        const result: {categories: CategoriesEntity[], count: number} = await this.categoriesRepository.getCategoryList(query)
        throw new OkException(`category_list`, result, `List of categories are successfully loaded.`)
    }

    async createCategory(dto: CreateCategoryDto): Promise<HttpException> {
        const newCategory: CategoriesEntity = await this.categoriesRepository.createCategory(dto)
        throw new OkException(`category_detail`, newCategory)
    }

    async deleteCategory(categoryId: string): Promise<HttpException> {
        const category: CategoriesEntity = await this.categoriesRepository.deleteCategory(categoryId)
        const id: string = String(category.id)
        delete category.id
        throw new OkException(`category_detail`, category, `Category ${category.name} is successfully deleted.`, id)
    }
}
