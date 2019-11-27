import { UnprocessableEntityException, BadRequestException, NotFoundException } from '@nestjs/common'
import { Repository, EntityRepository } from 'typeorm'
import { ProductsEntity } from '../Entities/products.entity'
import { CreateProductDto } from 'src/v1/Product/Dto/create-product.dto'
import { ObjectID } from 'mongodb'
import { Validator } from 'class-validator'

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
}
