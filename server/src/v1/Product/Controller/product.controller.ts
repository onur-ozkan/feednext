import { Controller, UseGuards, Headers, Post, Body, HttpException, Get, Param, Query } from '@nestjs/common'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport/dist/auth.guard'
import { RolesGuard } from 'src/shared/Guards/roles.guard'
import { ProductService } from '../Service/product.service'
import { CreateProductDto } from '../Dto/create-product.dto'
import { currentUserService } from 'src/shared/Services/current-user.service'
import { Roles } from 'src/shared/Decorators/roles.decorator'

@ApiUseTags('v1/product')
@Controller()
@UseGuards(RolesGuard)
@Controller()
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get(':productId')
    getCategory(@Param('productId') productId: string): Promise<HttpException> {
        return this.productService.getProduct(productId)
    }

    @Get('all')
    getCategoryList(@Query() query: { limit: number, skip: number, orderBy: any }): Promise<HttpException> {
        return this.productService.getProductList(query)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('create-product')
    @Roles(1)
    createProduct(@Headers('authorization') bearer: string, @Body() dto: CreateProductDto): Promise<HttpException> {
        return this.productService.createProduct(currentUserService.getCurrentUser(bearer, 'username'), dto)
    }
}
