// Nest dependencies
import { Injectable, HttpException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Local files
import { ProductsRepository } from 'src/shared/Repositories/products.repository'
import { CreateProductDto } from '../Dto/create-product.dto'
import { ProductsEntity } from 'src/shared/Entities/products.entity'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { UpdateProductDto } from '../Dto/update-product.dto'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductsRepository)
        private readonly productsRepository: ProductsRepository,
        @InjectRepository(CategoriesRepository)
        private readonly categoriesRepository: CategoriesRepository,
    ) {}

    async getProduct(productId: string): Promise<ISerializeResponse> {
        const product: ProductsEntity = await this.productsRepository.getProduct(productId)
        const id: string = String(product.id)
        delete product.id
        return serializerService.serializeResponse(`product_detail`, product, id)
    }

    async getProductList(query: { limit: number, skip: number, orderBy: any }): Promise<ISerializeResponse> {
        const result: {products: ProductsEntity[], count: number} = await this.productsRepository.getProductList(query)
        return serializerService.serializeResponse(`product_list`, result)
    }

    async createProduct(openedBy: string, dto: CreateProductDto): Promise<HttpException | ISerializeResponse> {
        try {
          await this.categoriesRepository.findOneOrFail(dto.categoryId)
        } catch (err) {
          throw new BadRequestException(`Category with id:${dto.categoryId} does not match in database.`)
        }

        const newProduct: ProductsEntity = await this.productsRepository.createProduct(openedBy, dto)
        return serializerService.serializeResponse(`product_detail`, newProduct)
    }

    async updateProduct(updatedBy: string, productId: string, dto: UpdateProductDto): Promise<ISerializeResponse> {
        const product: ProductsEntity = await this.productsRepository.updateProduct(updatedBy, productId, dto)
        const id: string = String(product.id)
        delete product.id
        return serializerService.serializeResponse(`product_detail`, product, id)
    }

    async deleteProduct(productId: string): Promise<ISerializeResponse> {
        const product: ProductsEntity = await this.productsRepository.deleteProduct(productId)
        const id: string = String(product.id)
        delete product.id
        return serializerService.serializeResponse(`product_detail`, product, id)
    }
}
