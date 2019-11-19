import { Injectable, BadRequestException, UnprocessableEntityException, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { CategoriesEntity } from 'src/shared/Entities/categories.entity'
import { OkException } from 'src/shared/Filters/ok-exception.filter'
import { CreateCategoryDto } from '../Dto/create-category.dto'
import { ObjectID } from 'mongodb'

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoriesRepository)
        private readonly categoriesRepository: CategoriesRepository,
    ) {}

    async createCategory(dto: CreateCategoryDto): Promise<HttpException> {
        if (dto.parentCategoryId) {
            try {
                await this.categoriesRepository.findOne(dto.parentCategoryId)
            } catch (err) {
                throw new BadRequestException(`${dto.parentCategoryId} does not match in database.`)
            }
        }

        const newCategory: CategoriesEntity = new CategoriesEntity({
            name: dto.categoryName,
            parent_category: ObjectID(dto.parentCategoryId) || null,
        })

        try {
            await this.categoriesRepository.save(newCategory)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }

        throw new OkException(`category`, newCategory)
    }
}
