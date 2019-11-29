import { UnprocessableEntityException, BadRequestException, NotFoundException } from '@nestjs/common'
import { Repository, EntityRepository } from 'typeorm'
import { ProductsEntity } from '../Entities/products.entity'
import { CreateProductDto } from 'src/v1/Product/Dto/create-product.dto'
import { ObjectID } from 'mongodb'
import { Validator } from 'class-validator'
import { UpdateProductDto } from 'src/v1/Product/Dto/update-product.dto'

@EntityRepository(ProductsEntity)
export class ProductsRepository extends Repository<ProductsEntity> {

    private validator: ObjectID

    constructor() {
      super()
      this.validator = new Validator()
    }

    async getProduct(productId: string): Promise<ProductsEntity> {
        if (!this.validator.isMongoId(productId)) throw new BadRequestException(`ProductId must be a MongoId.`)
        try {
            const product: ProductsEntity = await this.findOneOrFail(productId)
            return product
        } catch (err) {
            throw new NotFoundException(`Product with that id could not found in the database.`)
        }
    }

    async getProductList(query: { limit: number, skip: number, orderBy: any }): Promise<{products: ProductsEntity[], count: number}> {
        const orderBy = query.orderBy || 'ASC'

        try {
            const [products, total] = await this.findAndCount({
                order: {
                    name: orderBy.toUpperCase(),
                },
                take: Number(query.limit) || 10,
                skip: Number(query.skip) || 0,
            })
            return {
                products,
                count: total,
            }
        } catch (err) {
            throw new BadRequestException(err)
        }
    }

    async createProduct(openedBy: string, dto: CreateProductDto): Promise<ProductsEntity> {
        const newProduct: ProductsEntity = new ProductsEntity({
            name: dto.name,
            category_id: dto.categoryId,
            opened_by: openedBy,
        })

        try {
            return await this.save(newProduct)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }
    }

    async updateProduct(updatedBy: string, categoryId: string, dto: UpdateProductDto): Promise<ProductsEntity> {
        if (!this.validator.isMongoId(categoryId)) throw new BadRequestException(`CategoryId must be a MongoId.`)

        if (dto.categoryId) {
            try {
                await this.findOneOrFail(dto.categoryId)
            } catch (err) {
                throw new NotFoundException(`Category with that id could not found in the database.`)
            }
        }

        let product: ProductsEntity
        try {
            product = await this.findOneOrFail(categoryId)
        } catch {
            throw new NotFoundException(`Product related to that category id could not found in the database.`)
        }

        try {
            if (dto.name) product.name = dto.name
            if (dto.categoryId) product.category_id = dto.categoryId
            product.updated_by = updatedBy

            await this.save(product)
            return product
        } catch (err) {
            throw new BadRequestException(err.errmsg)
        }
    }

    async deleteProduct(productId: string): Promise<ProductsEntity> {
        if (!this.validator.isMongoId(productId)) throw new BadRequestException(`ProductId must be a MongoId.`)
        try {
            const product: ProductsEntity = await this.findOneOrFail(productId)
            await this.delete(product)
            return product
        } catch (err) {
            throw new NotFoundException(`Product with that id could not found in the database.`)
        }
    }
}
