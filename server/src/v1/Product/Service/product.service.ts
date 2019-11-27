import { Injectable, HttpException, BadRequestException } from '@nestjs/common'
import { ProductsRepository } from 'src/shared/Repositories/products.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateProductDto } from '../Dto/create-product.dto'
import { ProductsEntity } from 'src/shared/Entities/products.entity'
import { OkException } from 'src/shared/Filters/ok-exception.filter'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductsRepository)
        private readonly productsRepository: ProductsRepository,
        @InjectRepository(CategoriesRepository)
        private readonly categoriesRepository: CategoriesRepository,
    ) {}

    async getProduct(productId: string): Promise<HttpException> {
        const product: ProductsEntity = await this.productsRepository.getProduct(productId)
        const id: string = String(product.id)
        delete product.id
        throw new OkException(`product_detail`, product, `Product ${product.name} is successfully loaded.`, id)
    }

    async getProductList(query: { limit: number, skip: number, orderBy: any }): Promise<HttpException> {
      const result: {products: ProductsEntity[], count: number} = await this.productsRepository.getProductList(query)
      throw new OkException(`product_list`, result, `List of products are successfully loaded.`)
  }

    async createProduct(openedBy: string, dto: CreateProductDto): Promise<HttpException> {
        try {
          await this.categoriesRepository.findOneOrFail(dto.categoryId)
        } catch (err) {
          throw new BadRequestException(`Category with id:${dto.categoryId} does not match in database.`)
        }

        const newProduct: ProductsEntity = await this.productsRepository.createProduct(openedBy, dto)
        throw new OkException(`product_detail`, newProduct)
    }
}
