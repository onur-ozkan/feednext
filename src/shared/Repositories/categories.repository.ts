import { NotFoundException, BadRequestException, UnprocessableEntityException } from '@nestjs/common'
import { Repository, EntityRepository } from 'typeorm'
import { ObjectID } from 'mongodb'
import { CategoriesEntity } from '../Entities/categories.entity'
import { CreateCategoryDto } from 'src/v1/Category/Dto/create-category.dto'
import { Validator } from 'class-validator'

@EntityRepository(CategoriesEntity)
export class CategoriesRepository extends Repository<CategoriesEntity> {
    private validator: ObjectID

    constructor() {
      super()
      this.validator = new Validator()
    }

    async getCategory(categoryId: string): Promise<CategoriesEntity> {
        if (!this.validator.isMongoId(categoryId)) throw new BadRequestException(`CategoryId must be a MongoId.`)
        try {
            const category: CategoriesEntity = await this.findOneOrFail(categoryId)
            return category
        } catch (err) {
            throw new NotFoundException(`Category with that id could not found in the database.`)
        }
    }

    async createCategory(dto: CreateCategoryDto): Promise<CategoriesEntity> {
        if (dto.parentCategoryId) {
            try {
                await this.findOne(dto.parentCategoryId)
            } catch (err) {
                throw new BadRequestException(`${dto.parentCategoryId} does not match in database.`)
            }
        }

        const newCategory: CategoriesEntity = new CategoriesEntity({
            name: dto.categoryName,
            parent_category: ObjectID(dto.parentCategoryId) || null,
        })

        try {
            return await this.save(newCategory)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }
    }

    async deleteCategory(categoryId: string): Promise<CategoriesEntity> {
        if (!this.validator.isMongoId(categoryId)) throw new BadRequestException(`CategoryId must be a MongoId.`)
        try {
            const category: CategoriesEntity = await this.findOneOrFail(categoryId)
            await this.delete(category)
            return category
        } catch (err) {
            throw new NotFoundException(`Category with that id could not found in the database.`)
        }
    }

}
