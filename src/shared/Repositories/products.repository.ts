import { Repository, EntityRepository } from 'typeorm'
import { ProductsEntity } from '../Entities/products.entity'

@EntityRepository(ProductsEntity)
export class ProductsRepository extends Repository<ProductsEntity> {}
