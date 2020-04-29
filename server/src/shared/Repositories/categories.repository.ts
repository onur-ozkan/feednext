// Nest dependencies
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common'

// Other dependencies
import { Repository, EntityRepository } from 'typeorm'
import { ObjectId } from 'mongodb'

// Local files
import { CategoriesEntity } from '../Entities/categories.entity'
import { CreateCategoryDto } from 'src/v1/Category/Dto/create-category.dto'
import { UpdateCategoryDto } from 'src/v1/Category/Dto/update-category.dto'

@EntityRepository(CategoriesEntity)
export class CategoriesRepository extends Repository<CategoriesEntity> {
    async getCategory(categoryId: string): Promise<CategoriesEntity> {
        try {
            const category: CategoriesEntity = await this.findOneOrFail(categoryId)
            return category
        } catch (err) {
            throw new BadRequestException('Category with that id could not found in the database.')
        }
    }

    async getCategoryList(query: { skip: number }): Promise<{categories: CategoriesEntity[], count: number}> {
        const [categories, total] = await this.findAndCount({
            take: 10,
            skip: Number(query.skip) || 0,
        })
        return { categories, count: total }
    }

    async getCategoryListByIds(idList: string[]): Promise<{categories: CategoriesEntity[], count: number}> {
        const [categories, total] = await this.findAndCount({
            where: {
                '_id': {
                    $in: idList
                }
            },
            skip: 0,
        })
        return { categories, count: total }
    }

    async createCategory(dto: CreateCategoryDto): Promise<CategoriesEntity> {
        if (dto.parentCategoryId) {
            try {
                await this.findOneOrFail(dto.parentCategoryId)
            } catch (err) {
                throw new BadRequestException(`Category with id:${dto.parentCategoryId} does not match in database.`)
            }
        }

        const newCategory: CategoriesEntity = new CategoriesEntity({
            name: dto.categoryName,
            parent_category: (dto.parentCategoryId) ? ObjectId(dto.parentCategoryId) : null,
        })

        try {
            return await this.save(newCategory)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }
    }

    async updateCategory(categoryId: string, dto: UpdateCategoryDto): Promise<CategoriesEntity> {
        if (dto.parentCategoryId) {
            try {
                await this.findOneOrFail(dto.parentCategoryId)
            } catch (err) {
                throw new BadRequestException('Parent category with that id could not found in the database.')
            }
        }

        let category: CategoriesEntity
        try {
            category = await this.findOneOrFail(categoryId)
        } catch {
            throw new BadRequestException('Category with that id could not found in the database.')
        }

        try {
            if (dto.categoryName) category.name = dto.categoryName
            if (dto.parentCategoryId) category.parent_category = dto.parentCategoryId

            await this.save(category)
            return category
        } catch (err) {
            throw new BadRequestException(err.errmsg)
        }
    }

    async deleteCategory(categoryId: string): Promise<CategoriesEntity> {
        try {
            const category: CategoriesEntity = await this.findOneOrFail(categoryId)
            await this.delete(category)
            return category
        } catch (err) {
            throw new BadRequestException('Category with that id could not found in the database.')
        }
    }

}
