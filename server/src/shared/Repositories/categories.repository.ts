// Nest dependencies
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common'

// Other dependencies
import { Repository, EntityRepository } from 'typeorm'

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

    async getMainCategories(): Promise<{categories: CategoriesEntity[], count: number}> {
        const [categories, total] = await this.findAndCount({
            where: {
                parent_category: null
            },
            order: {
                name: 'ASC'
            }
        })
        return { categories, count: total }
    }

    async getChildCategories(categoryId: string): Promise<{categories: CategoriesEntity[], count: number}> {
        const [categories, total] = await this.findAndCount({
            where: {
                parent_category: categoryId,
            },
            order: {
                is_leaf: 'ASC',
                name: 'ASC'
            }
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
        const categoryPayload: {
            name: string,
            parent_category?: string,
            is_leaf: boolean,
            ancestors: string[]
        } = {
            name: dto.categoryName,
            is_leaf: dto.isLeaf,
            ancestors: []
        }

        if (dto.parentCategoryId) {
            try {
                const parentCategory = await this.findOneOrFail(dto.parentCategoryId)
                categoryPayload.parent_category = dto.parentCategoryId
                categoryPayload.ancestors.push(...parentCategory.ancestors, dto.parentCategoryId)
            } catch (err) {
                throw new BadRequestException(`Category with id:${dto.parentCategoryId} does not match in database.`)
            }
        }

        const newCategory: CategoriesEntity = new CategoriesEntity(categoryPayload)

        try {
            return await this.save(newCategory)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }
    }

    async updateCategory(categoryId: string, dto: UpdateCategoryDto): Promise<CategoriesEntity> {
        let parentCategory: CategoriesEntity | null = null
        if (dto.parentCategoryId) {
            try {
                parentCategory = await this.findOneOrFail(dto.parentCategoryId)
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
            if (dto.isLeaf !== undefined) category.is_leaf = dto.isLeaf
            if (parentCategory) {
                category.parent_category = dto.parentCategoryId
                category.ancestors = [...parentCategory.ancestors, String(parentCategory.id)]
            }

            await this.save(category)
            return category
        } catch (err) {
            throw new BadRequestException(err.errmsg)
        }
    }

    async deleteCategory(categoryId: string): Promise<void> {
        let category: CategoriesEntity
        try {
            category = await this.findOneOrFail(categoryId)
            await this.delete(category)
        } catch (err) {
            throw new BadRequestException('Category with that id could not found in the database.')
        }

        // Delete all child categories that belongs to deleted category
        const childCategories: any[]  = await this.find({
            where: {
                ancestors: {
                    $in: [String(category.id)]
                }
            },
        })
        await this.remove(childCategories)
    }

}
