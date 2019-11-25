import { UnprocessableEntityException } from '@nestjs/common'
import { Repository, EntityRepository } from 'typeorm'
import { ProductsEntity } from '../Entities/products.entity'
import { CreateProductDto } from 'src/v1/Product/Dto/create-product.dto'

@EntityRepository(ProductsEntity)
export class ProductsRepository extends Repository<ProductsEntity> {

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
